"use client";

import { Mail, Phone, User, type LucideIcon } from "lucide-react";
import { useId } from "react";
import type { FormFieldId } from "@/app/components/crm-template-editor/template-types";

const FIELD_LABEL_ICON: Record<FormFieldId, LucideIcon> = {
  firstName: User,
  lastName: User,
  email: Mail,
  phone: Phone,
};

export function FormFieldRow({
  label,
  labelClassName,
  fieldClassName,
  rowClassName,
  interactive = false,
  inputName,
  inputType = "text",
  autoComplete,
  fieldId,
}: {
  label: string;
  labelClassName: string;
  fieldClassName: string;
  rowClassName: string;
  interactive?: boolean;
  inputName?: string;
  inputType?: string;
  autoComplete?: string;
  /** When set, a Lucide icon is shown before the label (signup preview polish). */
  fieldId?: FormFieldId;
}) {
  const reactId = useId();
  const inputId = inputName ? `${inputName}-${reactId}` : `input-${reactId}`;
  const inputClassName = `${fieldClassName} min-w-0 border-0 bg-transparent px-3 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-900/15`;
  const Icon = fieldId ? FIELD_LABEL_ICON[fieldId] : null;

  return (
    <div className={rowClassName}>
      <label htmlFor={inputId} className={labelClassName}>
        <span className="inline-flex items-center gap-2">
          {Icon ? (
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm ring-1 ring-black/10"
              aria-hidden
            >
              <Icon className="size-3.5" strokeWidth={2} />
            </span>
          ) : null}
          <span>{label}</span>
        </span>
      </label>
      {interactive ? (
        <input
          id={inputId}
          name={inputName}
          type={inputType}
          autoComplete={autoComplete}
          className={inputClassName}
        />
      ) : (
        <div className={fieldClassName} aria-hidden />
      )}
    </div>
  );
}
