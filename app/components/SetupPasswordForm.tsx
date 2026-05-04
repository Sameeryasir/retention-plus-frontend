"use client";

import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const AUTH_PASSWORD_MIN = 8;

type SetupPasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirm: string;
};

export type SetupPasswordFormProps = {
  currentPasswordFromLogin: string;
  submitting: boolean;
  errorMessage: string | null;
  onSavePasswords: (currentPassword: string, newPassword: string) => Promise<void>;
};

const inputBase =
  "h-11 w-full rounded-xl border bg-zinc-50/50 py-2 text-[16px] leading-normal text-zinc-900 outline-none ring-zinc-900/0 transition-[border-color,box-shadow,background-color] placeholder:text-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-60";

function fieldRing(hasError: boolean) {
  return hasError
    ? "border-red-300 focus:border-red-400 focus:ring-red-900/10"
    : "border-zinc-200 focus:border-zinc-300";
}

export default function SetupPasswordForm({
  currentPasswordFromLogin,
  submitting,
  errorMessage,
  onSavePasswords,
}: SetupPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);

  const requireTypedCurrent =
    currentPasswordFromLogin.trim().length < AUTH_PASSWORD_MIN;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<SetupPasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirm: "",
    },
  });

  useEffect(() => {
    if (!requireTypedCurrent) {
      setValue("currentPassword", currentPasswordFromLogin, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [currentPasswordFromLogin, requireTypedCurrent, setValue]);

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-zinc-200/80 bg-white/90 p-8 shadow-xl shadow-zinc-200/40 ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-white shadow-lg shadow-zinc-900/25">
          <Lock className="h-6 w-6" strokeWidth={2} aria-hidden />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Set new password
        </h1>
        <p className="mt-1.5 whitespace-nowrap text-sm leading-relaxed text-zinc-500">
          Enter a new password (at least {AUTH_PASSWORD_MIN} characters).
        </p>
      </div>

      <form
        method="post"
        action="/"
        className="flex w-full flex-col gap-5 font-sans"
        noValidate
        onSubmit={handleSubmit((data) => {
          const current = requireTypedCurrent
            ? data.currentPassword.trim()
            : currentPasswordFromLogin.trim();
          if (
            requireTypedCurrent &&
            current.length < AUTH_PASSWORD_MIN
          ) {
            setError("currentPassword", {
              type: "manual",
              message: `Current password must be at least ${AUTH_PASSWORD_MIN} characters.`,
            });
            return;
          }
          if (data.newPassword.length < AUTH_PASSWORD_MIN) {
            setError("newPassword", {
              type: "manual",
              message: `New password must be at least ${AUTH_PASSWORD_MIN} characters.`,
            });
            return;
          }
          if (data.newPassword !== data.confirm) {
            setError("confirm", {
              type: "manual",
              message: "New passwords do not match.",
            });
            return;
          }
          void onSavePasswords(current, data.newPassword);
        })}
      >
        {requireTypedCurrent ? (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="setup-current-password"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
            >
              <Lock className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
              Current password
            </label>
            <div className="relative">
              <input
                id="setup-current-password"
                type={showCurrent ? "text" : "password"}
                autoComplete="current-password"
                disabled={submitting}
                aria-invalid={!!errors.currentPassword}
                className={`${inputBase} pl-4 pr-11 ${fieldRing(!!errors.currentPassword)}`}
                placeholder="Password you used to sign in"
                {...register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                disabled={submitting}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4 shrink-0" aria-hidden />
                ) : (
                  <Eye className="h-4 w-4 shrink-0" aria-hidden />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
        ) : (
          <input type="hidden" {...register("currentPassword")} />
        )}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="setup-new-password"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
          >
            <Lock className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
            New password
          </label>
          <div className="relative">
            <input
              id="setup-new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              disabled={submitting}
              aria-invalid={!!errors.newPassword}
              className={`${inputBase} pl-4 pr-11 ${fieldRing(!!errors.newPassword)}`}
              placeholder="Enter new password"
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              disabled={submitting}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 shrink-0" aria-hidden />
              ) : (
                <Eye className="h-4 w-4 shrink-0" aria-hidden />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="setup-confirm"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
          >
            <Lock className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
            Confirm new password
          </label>
          <input
            id="setup-confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            disabled={submitting}
            aria-invalid={!!errors.confirm}
            className={`${inputBase} px-4 ${fieldRing(!!errors.confirm)}`}
            placeholder="Confirm new password"
            {...register("confirm")}
          />
          {errors.confirm && (
            <p className="text-sm text-red-600">{errors.confirm.message}</p>
          )}
        </div>

        {errorMessage && (
          <div
            className="flex items-start gap-2 rounded-xl border border-red-200/80 bg-red-50/90 px-3 py-2.5 text-sm text-red-800"
            role="alert"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
              aria-hidden
            />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 text-base font-medium text-white shadow-lg shadow-zinc-900/25 transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <Loader2
              className="h-6 w-6 animate-spin text-white"
              strokeWidth={2.5}
              aria-hidden
            />
          ) : (
            "Save password"
          )}
        </button>
      </form>
    </div>
  );
}
