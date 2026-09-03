import type { ReactNode } from "react";

import { SignalIcon } from "@/components/ui/icons";

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
    <div className="bg-surface rounded-panel border border-dashed px-6 py-14 text-center">
      <span className="bg-surface-muted text-muted mx-auto grid size-12 place-items-center rounded-full">
        <SignalIcon className="size-5" />
      </span>
      <h3 className="mt-4 font-medium">{title}</h3>
      <p className="text-muted mx-auto mt-1.5 max-w-sm text-sm text-pretty">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
