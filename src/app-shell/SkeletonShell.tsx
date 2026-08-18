"use client";
export function SkeletonShell() {
  return (
    <div className="mx-auto min-h-screen max-w-md p-4">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-32 animate-pulse rounded bg-muted" />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="h-12 animate-pulse rounded bg-muted" />
        <div className="h-12 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
