import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

const validTypes: EmailOtpType[] = [
  "signup",
  "recovery",
  "invite",
  "magiclink",
  "email_change",
  "email",
];

export async function GET(request: NextRequest) {
  const tokenHash =
    request.nextUrl.searchParams.get("token_hash");

  const typeParam =
    request.nextUrl.searchParams.get("type");

  const origin = process.env.NEXT_PUBLIC_SITE_URL!;

  if (
    !tokenHash ||
    !typeParam ||
    !validTypes.includes(typeParam as EmailOtpType)
  ) {
    return NextResponse.redirect(
      new URL("/login?error=confirmation", origin)
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: typeParam as EmailOtpType,
  });

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=confirmation", origin)
    );
  }

  return NextResponse.redirect(
    new URL("/dashboard", origin)
  );
}