
"use client";

import { useActionState } from "react";
import Link from "next/link";

import { loginAction } from "@/features/auth/actions/auth.actions";
import { GoogleLoginButton } from "./google-login-button";

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

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    { error: null }
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to manage your football events.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <form action={formAction} className="space-y-4">
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
              autoComplete="current-password"
              required
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
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <GoogleLoginButton />

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
