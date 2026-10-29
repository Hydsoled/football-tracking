import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  page: number;
  totalPages: number;
  status: "upcoming" | "completed";
};

export function DashboardPagination({
  page,
  totalPages,
  status,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  function getUrl(targetPage: number) {
    const params = new URLSearchParams({
      status,
      page: String(targetPage),
    });

    return `/dashboard?${params.toString()}`;
  }

  return (
    <nav
      aria-label="Event pagination"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      {page > 1 ? (
        <Link
          href={getUrl(page - 1)}
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Previous
        </Link>
      ) : (
        <span />
      )}

      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      {page < totalPages ? (
        <Link
          href={getUrl(page + 1)}
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Next
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}