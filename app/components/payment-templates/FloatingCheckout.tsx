"use client";

import { CheckoutTemplateType } from "@/app/components/crm-template-editor/checkout-template-types";
import { BaseCheckoutLayout } from "@/app/components/payment-templates/BaseCheckoutLayout";
import type { CheckoutTemplateProps } from "@/app/components/payment-templates/types";

export function FloatingCheckout(props: CheckoutTemplateProps) {
  return (
    <BaseCheckoutLayout variant={CheckoutTemplateType.FLOATING} {...props} />
  );
}
