
"use client";

import { useActionState } from "react";
import Link from "next/link";

import { registerAction } from "@/features/auth/actions/auth.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GoogleLoginButton } from "./google-login-button";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    { error: null }
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Join and organize football matches.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                required
                minLength={2}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                required
                minLength={2}
                maxLength={50}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>

          {state.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={pending}
          >
            {pending ? "Creating account..." : "Register"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Or continue with
        </div>

        <GoogleLoginButton />

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
