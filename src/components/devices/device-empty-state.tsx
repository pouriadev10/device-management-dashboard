import type { ReactNode } from "react";

type DeviceEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function DeviceEmptyState({
  title,
  description,
  action,
}: DeviceEmptyStateProps) {
  return (
    <div className="bg-surface rounded-2xl border border-dashed px-6 py-14 text-center">
      <span
        aria-hidden
        className="bg-surface-muted mx-auto grid size-11 place-items-center rounded-full text-lg"
      >
        📡
      </span>
      <h3 className="mt-4 font-medium">{title}</h3>
      <p className="text-muted mx-auto mt-1 max-w-sm text-sm">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
