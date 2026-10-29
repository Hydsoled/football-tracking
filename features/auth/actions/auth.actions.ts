
"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
} from "@/features/auth/schemas/auth.schema";

export type AuthFormState = {
  error: string | null;
};

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: "Please check your registration details.",
    };
  }

  const { firstName, lastName, email, password } =
    parsed.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    // Do not leak whether an email address exists.
    return {
      error: "Registration could not be completed. Please try again.",
    };
  }

  redirect("/check-email");
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: "Please enter a valid email and password.",
    };
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      error: "Invalid credentials or account not confirmed.",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Unable to sign out.");
  }

  redirect("/login");
}
