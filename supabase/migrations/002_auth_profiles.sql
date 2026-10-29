
-- Run after 001_initial_schema.sql.

-- Automatically create a profile whenever a new
-- Supabase Auth account is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  display_name text;
begin
  display_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    ''
  );

  insert into public.profiles (
    id,
    first_name,
    last_name
  )
  values (
    new.id,
    coalesce(
      nullif(
        trim(new.raw_user_meta_data ->> 'first_name'),
        ''
      ),
      split_part(display_name, ' ', 1),
      ''
    ),
    coalesce(
      nullif(
        trim(new.raw_user_meta_data ->> 'last_name'),
        ''
      ),
      case
        when position(' ' in display_name) > 0
        then substring(
          display_name from position(' ' in display_name) + 1
        )
        else ''
      end
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Existing profile RLS policies from migration 001
-- remain in place.
