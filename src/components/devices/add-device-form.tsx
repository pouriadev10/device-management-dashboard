"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  createNewDeviceSchema,
  DEVICE_STATUSES,
} from "@/features/devices/schemas";
import type { NewDeviceInput } from "@/features/devices/types";
import { useI18n } from "@/features/i18n/i18n-provider";

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
  const i18n = useI18n();
  const { t } = i18n;

  // The schema carries the messages someone reads when they get it wrong, so it
  // is rebuilt when the language changes rather than pinned to English.
  const schema = useMemo(() => createNewDeviceSchema(i18n), [i18n]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewDeviceInput>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field label={t("form.name.label")} error={errors.name?.message}>
        {(field) => (
          <Input
            {...field}
            autoFocus
            placeholder={t("form.name.placeholder")}
            {...register("name")}
          />
        )}
      </Field>

      <Field label={t("form.ip.label")} error={errors.ip?.message}>
        {(field) => (
          <Input
            {...field}
            // "decimal", not "numeric": the numeric keypad on phones has no dot
            // key, so the octet separators can't be typed. "decimal" keeps the
            // number-first keyboard but includes the ".".
            inputMode="decimal"
            // An address is written left to right whatever the page direction.
            dir="ltr"
            placeholder={t("form.ip.placeholder")}
            className="font-mono"
            {...register("ip")}
          />
        )}
      </Field>

      <Field label={t("form.status.label")} error={errors.status?.message}>
        {(field) => (
          <Select {...field} {...register("status")}>
            {DEVICE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`status.${status}`)}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("devices.add.pending") : t("devices.add")}
        </Button>
      </div>
    </form>
  );
}
