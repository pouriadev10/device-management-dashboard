"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
};

/**
 * Built on the native `<dialog>` element, which brings the awkward parts of a
 * modal with it: focus is trapped while it is open, Escape closes it, the rest
 * of the page is inert, and it renders in the top layer so no z-index fights.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Fires for every close, including Escape, so state stays in step.
      onClose={onClose}
      // The dialog element itself is the backdrop; the panel inside is not.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className={cn(
        "bg-surface text-foreground rounded-panel shadow-overlay m-auto w-[calc(100vw-2rem)] max-w-md border p-0",
        "backdrop:bg-[var(--overlay)] backdrop:backdrop-blur-[2px]",
      )}
    >
      <div className="p-6">
        <h2 id={titleId} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {description ? (
          <p
            id={descriptionId}
            className="text-muted mt-1.5 text-sm text-pretty"
          >
            {description}
          </p>
        ) : null}

        <div className="mt-6">{children}</div>
      </div>
    </dialog>
  );
}
