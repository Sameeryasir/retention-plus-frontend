import type { TemplatePagesState } from "@/app/components/crm-template-editor/template-types";

export function mergePagesForSave(
  loaded: TemplatePagesState,
  editor: TemplatePagesState,
): TemplatePagesState {
  return {
    ...loaded,
    landing: editor.landing,
    signup: editor.signup,
    payment: editor.payment,
    confirmation: editor.confirmation,
  };
}
