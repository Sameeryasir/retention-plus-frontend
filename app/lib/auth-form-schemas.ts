import { z } from "zod";

export const AUTH_PASSWORD_MIN = 8;

export const loginSchema = z.object({
  email: z.string().min(1, "Enter your email.").email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const otpCodeSchema = z.object({
  code: z
    .string()
    .length(6, "Enter all 6 digits.")
    .regex(/^\d{6}$/, "Use digits only."),
});

export type OtpFormValues = z.infer<typeof otpCodeSchema>;

export function createSetupPasswordSchema(requireTypedCurrent: boolean) {
  return z
    .object({
      currentPassword: z.string(),
      newPassword: z
        .string()
        .min(
          AUTH_PASSWORD_MIN,
          `New password must be at least ${AUTH_PASSWORD_MIN} characters.`,
        ),
      confirm: z.string().min(1, "Confirm your new password."),
    })
    .superRefine((data, ctx) => {
      if (requireTypedCurrent && data.currentPassword.trim().length < AUTH_PASSWORD_MIN) {
        ctx.addIssue({
          code: "custom",
          path: ["currentPassword"],
          message: `Current password must be at least ${AUTH_PASSWORD_MIN} characters.`,
        });
      }
      if (data.newPassword !== data.confirm) {
        ctx.addIssue({
          code: "custom",
          path: ["confirm"],
          message: "New passwords do not match.",
        });
      }
    });
}

export type SetupPasswordFormValues = z.infer<
  ReturnType<typeof createSetupPasswordSchema>
>;
