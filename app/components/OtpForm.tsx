"use client";

import {
  otpCodeSchema,
  type OtpFormValues,
} from "@/app/lib/auth-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  KeyRound,
  Loader2,
  LogIn,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useForm } from "react-hook-form";

const OTP_LENGTH = 6;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export type OtpFormProps = {
  pendingLoginEmail: string;
  onVerifyOtp: (otp: number) => Promise<void>;
  onResendOtp: () => Promise<void>;
};

const cellBase =
  "h-11 w-full min-w-0 rounded-xl border bg-zinc-50/50 text-center text-lg font-semibold tabular-nums text-zinc-900 outline-none ring-zinc-900/0 transition-all focus:bg-white focus:ring-4 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-60";

function cellRing(hasError: boolean) {
  return hasError
    ? "border-red-300 focus:border-red-400 focus:ring-red-900/10"
    : "border-zinc-200 focus:border-zinc-300";
}

export default function OtpForm({
  pendingLoginEmail,
  onVerifyOtp,
  onResendOtp,
}: OtpFormProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpCodeSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    setValue("code", digits.join(""), { shouldValidate: false });
  }, [digits, setValue]);

  const focusInput = useCallback((index: number) => {
    const el = inputRefs.current[index];
    if (el) {
      el.focus();
      el.select();
    }
  }, []);

  const handleChange = useCallback(
    (index: number, raw: string) => {
      const onlyDigits = raw.replace(/\D/g, "");
      if (onlyDigits.length > 1) {
        const spread = onlyDigits.slice(0, OTP_LENGTH).split("");
        setDigits((prev) => {
          const next = [...prev];
          for (let i = 0; i < spread.length; i++) {
            if (index + i < OTP_LENGTH) next[index + i] = spread[i] ?? "";
          }
          return next;
        });
        const nextIndex = Math.min(index + spread.length, OTP_LENGTH - 1);
        focusInput(nextIndex);
        return;
      }

      const digit = onlyDigits.slice(-1);
      setDigits((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });
      if (digit && index < OTP_LENGTH - 1) {
        focusInput(index + 1);
      }
    },
    [focusInput],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      }
      if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      }
      if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [digits, focusInput],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLFormElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
      if (!text) return;
      const chars = text.split("");
      setDigits((prev) => {
        const next = [...prev];
        chars.forEach((c, i) => {
          if (i < OTP_LENGTH) next[i] = c;
        });
        return next;
      });
      focusInput(Math.min(chars.length, OTP_LENGTH - 1));
    },
    [focusInput],
  );

  const onValidCode = async (values: OtpFormValues) => {
    if (loading) return;
    if (!pendingLoginEmail) {
      setError("Missing email. Go back to log in and try again.");
      return;
    }

    setError(null);
    setLoading(true);
    const otp = Number.parseInt(values.code, 10);
    try {
      await onVerifyOtp(otp);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  function onSubmitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void handleSubmit(onValidCode)(e);
  }

  async function handleResend() {
    if (resendLoading || loading) return;
    if (!pendingLoginEmail) {
      setError("Missing email. Go back to log in and try again.");
      return;
    }

    setError(null);
    setResendLoading(true);
    try {
      await onResendOtp();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setResendLoading(false);
    }
  }

  const codeInvalid = !!errors.code;

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-zinc-200/80 bg-white/90 p-8 shadow-xl shadow-zinc-200/40 ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-white shadow-lg shadow-zinc-900/25">
          <KeyRound className="h-6 w-6" strokeWidth={2} aria-hidden />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Verification code
        </h1>
        <p className="mt-1.5 max-w-[280px] text-sm leading-relaxed text-zinc-500">
          Enter the {OTP_LENGTH}-digit code we sent you to continue.
        </p>
      </div>

      <form
        method="post"
        action="/"
        autoComplete="off"
        className="flex w-full flex-col gap-5 font-sans"
        onSubmit={onSubmitForm}
        onPaste={handlePaste}
        noValidate
      >
        <input type="hidden" {...register("code")} />

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center justify-center gap-1.5 text-sm font-medium text-zinc-700">
            <span>One-time password</span>
          </label>

          <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                id={`otp-${index}`}
                name={`otp-${index}`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                disabled={loading}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                aria-invalid={codeInvalid}
                className={`${cellBase} ${cellRing(codeInvalid)}`}
              />
            ))}
          </div>
          {errors.code && (
            <p className="text-center text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        {error && (
          <div
            className="flex items-start gap-2 rounded-xl border border-red-200/80 bg-red-50/90 px-3 py-2.5 text-sm text-red-800"
            role="alert"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
              aria-hidden
            />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          aria-label={loading ? "Verifying" : "Verify"}
          className="group mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 text-base font-medium text-white shadow-lg shadow-zinc-900/25 transition-all duration-200 ease-out hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2
              className="h-6 w-6 animate-spin text-white"
              strokeWidth={2.5}
              aria-hidden
            />
          ) : (
            <>
              <span>Verify</span>
              <LogIn
                className="h-5 w-5 opacity-90 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden
              />
            </>
          )}
        </button>
      </form>

        <p className="mt-6 text-center text-sm">
        <button
          type="button"
          className="font-medium text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-900 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading || resendLoading}
          onClick={() => void handleResend()}
        >
          {resendLoading ? "Sending…" : "Resend code"}
        </button>
      </p>

      <p className="mt-6 text-center text-xs text-zinc-400">
        Didn&apos;t receive a code? Check spam or request a new one above.
      </p>
    </div>
  );
}
