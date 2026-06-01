import type { TemplatePageBase } from "@/app/components/crm-template-editor/template-types";

export const CONFIRMATION_DEFAULT_HEADING = "Thank you!";
export const CONFIRMATION_DEFAULT_SUBHEADING = "Your payment has been confirmed.";
export const CONFIRMATION_DEFAULT_BODY = `We're glad you're with us. You'll receive a confirmation email shortly with your receipt and any next steps.

If your bank needs extra verification, follow any prompts from Stripe.`;

const PLACEHOLDER_SNIPPET = "lorem ipsum";

function isPlaceholderCopy(value: string | undefined | null): boolean {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return true;
  return trimmed.toLowerCase().includes(PLACEHOLDER_SNIPPET);
}

export function resolveConfirmationContent(
  page: Pick<TemplatePageBase, "heading" | "subheading" | "body">,
): Pick<TemplatePageBase, "heading" | "subheading" | "body"> {
  return {
    heading: isPlaceholderCopy(page.heading)
      ? CONFIRMATION_DEFAULT_HEADING
      : page.heading.trim(),
    subheading: isPlaceholderCopy(page.subheading)
      ? CONFIRMATION_DEFAULT_SUBHEADING
      : page.subheading.trim(),
    body: isPlaceholderCopy(page.body)
      ? CONFIRMATION_DEFAULT_BODY
      : page.body.trim(),
  };
}
