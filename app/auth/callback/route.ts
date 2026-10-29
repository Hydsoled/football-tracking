import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");

  // Use a configured application origin rather than
  // trusting arbitrary forwarded-host headers.
  const origin = process.env.NEXT_PUBLIC_SITE_URL!;

  if (code) {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(
        new URL("/dashboard", origin)
      );
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=auth", origin)
  );
}