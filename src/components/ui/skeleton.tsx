import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("bg-foreground/10 animate-pulse rounded-md", className)}
    />
  );
}
