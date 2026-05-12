"use client";

import type { ReactNode } from "react";
import { FormFieldRow } from "@/app/components/crm-template-editor/form-designs/FormFieldRow";
import { FormPresetExtra } from "@/app/components/crm-template-editor/form-designs/FormPresetExtra";
import {
  formDesignUsesSplitLayout,
  getFormDesignStyle,
  getNonSplitShellClass,
} from "@/app/components/crm-template-editor/form-designs/registry";
import { SplitFormLayout } from "@/app/components/crm-template-editor/form-designs/SplitFormLayout";
import { FORM_FIELD_OPTIONS } from "@/app/components/crm-template-editor/template-data";
import type { FormDesign } from "@/app/components/crm-template-editor/form-designs/types";
import type { FormFieldId } from "@/app/components/crm-template-editor/template-types";

export function SignupFormFields({
  fieldIds,
  design,
  imageUrl,
  imageScale,
  interactive = false,
  omitInteractiveForm = false,
}: {
  fieldIds: FormFieldId[];
  design: FormDesign;
  imageUrl: string;
  imageScale: number;
  interactive?: boolean;
  omitInteractiveForm?: boolean;
}) {
  const labels = Object.fromEntries(
    FORM_FIELD_OPTIONS.map((o) => [o.id, o.label]),
  ) as Record<FormFieldId, string>;

  const style = getFormDesignStyle(design);

  const fields = fieldIds.map((id) => (
    <FormFieldRow
      key={id}
      label={labels[id]}
      labelClassName={style.labelClass}
      fieldClassName={style.fieldClass}
      rowClassName={style.rowClass}
      interactive={interactive}
      fieldId={id}
      inputName={id}
      inputType={
        id === "email" ? "email" : id === "phone" ? "tel" : "text"
      }
      autoComplete={
        id === "email"
          ? "email"
          : id === "phone"
            ? "tel"
            : id === "firstName"
              ? "given-name"
              : "family-name"
      }
    />
  ));

  const inner = (
    <>
      <FormPresetExtra design={design} />
      <div className={style.fieldsContainerClass}>{fields}</div>
    </>
  );

  const wrapForm = (node: ReactNode) =>
    interactive && !omitInteractiveForm ? (
      <form
        noValidate
        className="contents"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {node}
      </form>
    ) : (
      node
    );

  if (formDesignUsesSplitLayout(design)) {
    return wrapForm(
      <SplitFormLayout design={design} imageUrl={imageUrl} imageScale={imageScale}>
        {inner}
      </SplitFormLayout>,
    );
  }

  const shell = getNonSplitShellClass(design);
  return wrapForm(<div className={shell}>{inner}</div>);
}
