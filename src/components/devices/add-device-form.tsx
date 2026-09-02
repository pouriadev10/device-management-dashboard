"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DEVICE_STATUSES, newDeviceSchema } from "@/features/devices/schemas";
import type { NewDeviceInput } from "@/features/devices/types";

type AddDeviceFormProps = {
  onSubmit: (device: NewDeviceInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

const DEFAULT_VALUES: NewDeviceInput = {
  name: "",
  ip: "",
  status: "Online",
};

export function AddDeviceForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AddDeviceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewDeviceInput>({
    resolver: zodResolver(newDeviceSchema),
    defaultValues: DEFAULT_VALUES,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field
        htmlFor="device-name"
        label="Device name"
        error={errors.name?.message}
      >
        <Input
          id="device-name"
          autoFocus
          placeholder="Core-Switch-02"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "device-name-error" : undefined}
          {...register("name")}
        />
      </Field>

      <Field htmlFor="device-ip" label="IP address" error={errors.ip?.message}>
        <Input
          id="device-ip"
          inputMode="numeric"
          placeholder="192.168.1.2"
          className="font-mono"
          aria-invalid={errors.ip ? true : undefined}
          aria-describedby={errors.ip ? "device-ip-error" : undefined}
          {...register("ip")}
        />
      </Field>

      <Field
        htmlFor="device-status"
        label="Initial status"
        error={errors.status?.message}
      >
        <Select id="device-status" {...register("status")}>
          {DEVICE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding…" : "Add device"}
        </Button>
      </div>
    </form>
  );
}
