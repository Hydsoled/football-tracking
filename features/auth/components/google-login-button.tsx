"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleGoogleLogin() {
    setLoading(true);
    setErrorMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage("Unable to start Google sign-in.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={loading}
        onClick={handleGoogleLogin}
      >
        {loading ? "Connecting..." : "Continue with Google"}
      </Button>

      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}