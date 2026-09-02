import type { ReactNode } from "react";

type FieldProps = {
  /** Must match the id of the control rendered as `children`. */
  htmlFor: string;
  label: string;
  error?: string | undefined;
  children: ReactNode;
};

/**
 * Label, control and validation message as one unit. The message carries the
 * id that the control points at with `aria-describedby`, so screen readers
 * announce the error with the field rather than as loose text.
 */
export function Field({ htmlFor, label, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-sm text-rose-600 dark:text-rose-400"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
