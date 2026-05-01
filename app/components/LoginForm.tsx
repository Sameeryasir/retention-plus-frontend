"use client";

import {
  loginSchema,
  type LoginFormValues,
} from "@/app/lib/auth-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export type LoginFormProps = {
  submitting: boolean;
  errorMessage: string | null;
  onCredentialsSubmit: (email: string, password: string) => Promise<void>;
};

const inputBase =
  "h-11 w-full rounded-xl border bg-zinc-50/50 px-4 text-[16px] leading-normal text-zinc-900 outline-none ring-zinc-900/0 transition-[border-color,box-shadow,background-color] placeholder:text-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-60";

function fieldRing(hasError: boolean) {
  return hasError
    ? "border-red-300 focus:border-red-400 focus:ring-red-900/10"
    : "border-zinc-200 focus:border-zinc-300";
}

export default function LoginForm({
  submitting,
  errorMessage,
  onCredentialsSubmit,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [ignoreAutofill, setIgnoreAutofill] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-zinc-200/80 bg-white/90 p-8 shadow-xl shadow-zinc-200/40 ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-white shadow-lg shadow-zinc-900/25">
          <LogIn className="h-6 w-6" strokeWidth={2} aria-hidden />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Welcome back
        </h1>
        <p className="mt-1.5 max-w-[280px] text-sm leading-relaxed text-zinc-500">
          Sign in to continue.
        </p>
      </div>

      <form
        method="post"
        action="/"
        className="flex w-full flex-col gap-5 font-sans"
        onSubmit={handleSubmit((data) => onCredentialsSubmit(data.email, data.password))}
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="login-email"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
          >
            <Mail className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
            Email
          </label>

          <input
            id="login-email"
            type="email"
            autoComplete="username"
            disabled={submitting}
            readOnly={ignoreAutofill}
            onFocus={() => setIgnoreAutofill(false)}
            aria-invalid={!!errors.email}
            className={`${inputBase} py-2 read-only:bg-zinc-50/50 ${fieldRing(!!errors.email)}`}
            placeholder="Enter email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="login-password"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
            >
              <Lock className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
              Password
            </label>
            <a
              href="#"
              className="text-xs font-medium text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-800 hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          </div>

          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={submitting}
              readOnly={ignoreAutofill}
              onFocus={() => setIgnoreAutofill(false)}
              aria-invalid={!!errors.password}
              className={`${inputBase} py-2 pl-4 pr-11 read-only:bg-zinc-50/50 ${fieldRing(!!errors.password)}`}
              placeholder="Enter password"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
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
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
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
          aria-busy={submitting}
          aria-label={submitting ? "Signing in" : "Login"}
          className="group mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 text-base font-medium text-white shadow-lg shadow-zinc-900/25 transition-all duration-200 ease-out hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <Loader2
              className="h-6 w-6 animate-spin text-white"
              strokeWidth={2.5}
              aria-hidden
            />
          ) : (
            <>
              <span>Login</span>
              <LogIn
                className="h-5 w-5 opacity-90 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden
              />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-zinc-400">
        Protected sign-in. Use the credentials provided by your administrator.
      </p>
    </div>
  );
}
