export function DashboardSkeleton() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 p-8">
      <div className="h-9 w-48 animate-pulse rounded bg-muted" />
      <div className="h-5 w-64 animate-pulse rounded bg-muted" />
    </main>
  );
}