import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CheckEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If your registration was accepted, follow the
            confirmation instructions sent to your email.
          </p>

          <Link href="/login" className="underline">
            Return to login
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}