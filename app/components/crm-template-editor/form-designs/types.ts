export type FormSwatchKind =
  | "card"
  | "split"
  | "dark"
  | "neon"
  | "underline"
  | "glass"
  | "gold"
  | "rounded"
  | "pill";

export type FormSplitVariant = null | "neutral" | "gradient" | "warm" | "shop";

export type FormDesign =
  | "stacked_input_form"
  | "two_column_form"
  | "floating_label_form"
  | "underline_input_form"
  | "outlined_material_form"
  | "soft_shadow_form"
  | "glassmorphism_form"
  | "neumorphism_form"
  | "pill_input_form"
  | "sharp_edge_form"
  | "minimal_border_form"
  | "thin_line_form"
  | "bold_label_form"
  | "compact_dense_form"
  | "spacious_airy_form"
  | "dark_mode_form"
  | "light_panel_form"
  | "gradient_background_form"
  | "transparent_form"
  | "elevated_card_form"
  | "flat_modern_form"
  | "sectioned_form"
  | "centered_form"
  | "left_aligned_form"
  | "right_aligned_form"
  | "full_width_form"
  | "rounded_corner_form"
  | "square_input_form"
  | "soft_pastel_form"
  | "high_contrast_form"
  | "mobile_app_form"
  | "desktop_business_form"
  | "inline_label_form"
  | "top_label_form"
  | "animated_focus_form"
  | "glow_border_form"
  | "clean_saas_form"
  | "elegant_luxury_form"
  | "modern_shopify_form"
  | "professional_corporate_form";

export interface FormDesignStyle {
  shellClass: string;
  labelClass: string;
  fieldClass: string;
  rowClass: string;
  fieldsContainerClass: string;
  splitVariant: FormSplitVariant;
  swatchKind: FormSwatchKind;
  extra?: "wizard" | "social" | "coupon";
}

export interface FormDesignOptionRow {
  value: FormDesign;
  label: string;
  description: string;
}
