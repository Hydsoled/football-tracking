import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="space-y-3">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-72 max-w-full" />
      </div>

      <Skeleton className="h-10 w-64 max-w-full" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-3">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>

            <CardContent className="space-y-5">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}