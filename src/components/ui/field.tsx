import { useId, type ReactNode } from "react";

/** The wiring a control needs to be announced correctly with its label and error. */
type FieldControlProps = {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
};

type FieldProps = {
  label: string;
  error?: string | undefined;
  children: (control: FieldControlProps) => ReactNode;
};

/**
 * Label, control and validation message as one unit.
 *
 * The ids are generated here and handed to the control, rather than each call
 * site inventing a string and repeating it three times. That coupling used to
 * be invisible: renaming a field's id silently detached its error message from
 * the control, and the check that would have caught it is the one nobody runs.
 */
export function Field({ label, error, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-rose-600 dark:text-rose-400"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
