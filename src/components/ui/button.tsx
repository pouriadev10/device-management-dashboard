import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "icon";

const BASE_STYLES =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-control text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-panel hover:bg-primary-hover active:translate-y-px",
  secondary:
    "bg-surface border-border-strong shadow-panel border hover:bg-surface-muted active:translate-y-px",
  ghost: "text-muted hover:bg-surface-muted hover:text-foreground",
  danger:
    "bg-danger text-danger-foreground shadow-panel hover:bg-danger-hover active:translate-y-px",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-2.5",
  md: "h-10 px-4",
  // Square, for a control whose icon is the whole label.
  icon: "size-9",
};

type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        BASE_STYLES,
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      )}
      {...props}
    />
  );
}
