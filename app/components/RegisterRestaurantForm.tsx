"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Building2,
  FileText,
  Flag,
  Globe,
  Hash,
  ImageIcon,
  Images,
  Landmark,
  Loader2,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  Store,
  Upload,
  UtensilsCrossed,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export type RegisterRestaurantFormValues = {
  name: string;
  phoneNumber: string;
  cuisineType: string;
  email: string;
  description: string;
  websiteUrl: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  branchCount: number;
  logoUrl?: string;
};

export type RegisterRestaurantFormProps = {
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (data: RegisterRestaurantFormValues) => Promise<void>;
};

const inputBase =
  "h-11 w-full rounded-xl border bg-white px-4 text-[16px] leading-normal text-zinc-900 outline-none ring-zinc-900/0 transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-60";

const selectBase = `${inputBase} appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat py-2 pr-10`;

const textareaBase =
  "min-h-[100px] w-full rounded-xl border bg-white px-4 py-3 text-[16px] leading-relaxed text-zinc-900 outline-none ring-zinc-900/0 transition placeholder:text-zinc-400 focus:ring-4 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-60";

function fieldRing(hasError: boolean) {
  return hasError
    ? "border-red-300 focus:border-red-400 focus:ring-red-900/10"
    : "border-zinc-200 focus:border-zinc-300";
}

function optionalUrlRule(value: string) {
  const t = value.trim();
  if (t.length === 0) return true;
  try {
    new URL(t);
    return true;
  } catch {
    return "Enter a full URL (e.g. https://example.com).";
  }
}

const MAX_LOGO_BYTES = 10 * 1024 * 1024;
const ACCEPT_IMAGES = "image/png,image/jpeg,image/webp";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileKindLabel(mime: string): string {
  if (mime === "image/png") return "PNG";
  if (mime === "image/jpeg") return "JPG";
  if (mime === "image/webp") return "WEBP";
  return "Image";
}

function shortenFileName(name: string, max = 44): string {
  if (name.length <= max) return name;
  const lastDot = name.lastIndexOf(".");
  const ext = lastDot > 0 ? name.slice(lastDot) : "";
  const stem = lastDot > 0 ? name.slice(0, lastDot) : name;
  const budget = max - ext.length - 1;
  if (budget < 10) return `${name.slice(0, max - 1)}…`;
  const head = Math.ceil(budget * 0.55);
  const tail = budget - head;
  return `${stem.slice(0, head)}…${stem.slice(-tail)}${ext}`;
}

function isImageMime(mime: string): boolean {
  return mime === "image/png" || mime === "image/jpeg" || mime === "image/webp";
}

const CUISINE_OPTIONS = [
  { value: "", label: "Select cuisine type" },
  { value: "italian", label: "Italian" },
  { value: "mexican", label: "Mexican" },
  { value: "american", label: "American" },
  { value: "indian", label: "Indian" },
  { value: "pakistani", label: "Pakistani" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "french", label: "French" },
  { value: "thai", label: "Thai" },
  { value: "other", label: "Other" },
];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function RequiredStar() {
  return <span className="text-red-500">*</span>;
}

type LogoDropProps = {
  id: string;
  label: string;
  labelIcon?: LucideIcon;
  disabled: boolean;
  file: File | null;
  error?: string;
  onFile: (file: File | null) => void;
};

function RestaurantLogoDropField({
  id,
  label,
  labelIcon: LabelIcon,
  disabled,
  file,
  error,
  onFile,
}: LogoDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | undefined>();

  const imagePreviewUrl = useMemo(() => {
    if (!file || !isImageMime(file.type)) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (!imagePreviewUrl) return;
    return () => URL.revokeObjectURL(imagePreviewUrl);
  }, [imagePreviewUrl]);

  const pick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const validateAndSet = useCallback(
    (f: File | null, inputEl: HTMLInputElement | null) => {
      setLocalError(undefined);
      if (!f) {
        onFile(null);
        return;
      }
      if (!["image/png", "image/jpeg", "image/webp"].includes(f.type)) {
        setLocalError("Use PNG, JPG, or WEBP only.");
        if (inputEl) inputEl.value = "";
        return;
      }
      if (f.size > MAX_LOGO_BYTES) {
        setLocalError("File must be 10MB or smaller.");
        if (inputEl) inputEl.value = "";
        return;
      }
      onFile(f);
    },
    [onFile],
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null;
      validateAndSet(f, e.target);
    },
    [validateAndSet],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      const f = e.dataTransfer.files?.[0] ?? null;
      validateAndSet(f, inputRef.current);
    },
    [disabled, validateAndSet],
  );

  const clearFile = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setLocalError(undefined);
      if (inputRef.current) inputRef.current.value = "";
      onFile(null);
    },
    [onFile],
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
      >
        {LabelIcon ? (
          <LabelIcon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
        ) : null}
        {label}
      </label>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPT_IMAGES}
        className="sr-only"
        disabled={disabled}
        onChange={onChange}
      />

      {file ? (
        <div
          className={`w-full min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/40 shadow-sm ring-1 ring-black/[0.03] ${disabled ? "pointer-events-none opacity-60" : ""}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <div className="flex w-full min-w-0 items-stretch gap-3 p-3 sm:gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
              {imagePreviewUrl ? (
                <Image
                  src={imagePreviewUrl}
                  alt=""
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-600">
                  <ImageIcon className="h-7 w-7" aria-hidden strokeWidth={1.75} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 overflow-hidden py-0.5">
              <p
                className="break-all text-sm font-semibold leading-snug text-zinc-900 sm:break-normal sm:truncate"
                title={file.name}
              >
                {shortenFileName(file.name)}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {fileKindLabel(file.type)} · {formatFileSize(file.size)}
              </p>
              {!disabled ? (
                <button
                  type="button"
                  onClick={pick}
                  className="mt-2 text-left text-xs font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-2 transition hover:text-black hover:decoration-zinc-500"
                >
                  Replace file…
                </button>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <button
                type="button"
                disabled={disabled}
                onClick={clearFile}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition hover:border-zinc-300 hover:bg-white hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-50"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" aria-hidden strokeWidth={2} />
              </button>
            </div>
          </div>
          {!disabled ? (
            <p className="border-t border-zinc-200/80 bg-white/60 px-3 py-2 text-center text-[11px] text-zinc-500">
              Drag a new image here to replace
            </p>
          ) : null}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              pick();
            }
          }}
          onClick={pick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`flex min-h-[160px] min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-8 text-center transition hover:border-zinc-300 hover:bg-zinc-50 ${disabled ? "pointer-events-none opacity-60" : ""}`}
        >
          <Upload className="h-8 w-8 text-zinc-400" strokeWidth={1.5} aria-hidden />
          <span className="text-sm font-medium text-zinc-700">
            Click to upload or drag and drop
          </span>
          <span className="text-xs text-zinc-500">PNG, JPG or WEBP (max 10MB)</span>
        </div>
      )}

      {(error ?? localError) ? (
        <p className="text-sm text-red-600">{error ?? localError}</p>
      ) : null}
    </div>
  );
}

export default function RegisterRestaurantForm({
  submitting,
  errorMessage,
  onSubmit,
}: RegisterRestaurantFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoFileError, setLogoFileError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRestaurantFormValues>({
    defaultValues: {
      name: "",
      phoneNumber: "",
      cuisineType: "",
      email: "",
      description: "",
      websiteUrl: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      branchCount: 1,
    },
  });

  const submit = handleSubmit(async (data) => {
    setLogoFileError(undefined);

    let logoUrl: string | undefined;

    if (logoFile) {
      try {
        logoUrl = await fileToDataUrl(logoFile);
      } catch {
        setLogoFileError("Could not read logo file.");
        return;
      }
    }

    await onSubmit({
      ...data,
      branchCount: 1,
      logoUrl,
    });
  });

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm ring-1 ring-black/[0.03] sm:p-8 lg:p-10">
      <form className="flex flex-col gap-10 font-sans" onSubmit={submit} noValidate>
        <section className="flex flex-col gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="restaurant-name"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
              >
                <Building2 className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                Restaurant Name <RequiredStar />
              </label>
              <input
                id="restaurant-name"
                type="text"
                autoComplete="organization"
                disabled={submitting}
                placeholder="Enter restaurant name"
                aria-invalid={!!errors.name}
                className={`${inputBase} py-2 ${fieldRing(!!errors.name)}`}
                {...register("name", { required: "Restaurant name is required." })}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="restaurant-phone"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
              >
                <Phone className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                Contact Number <RequiredStar />
              </label>
              <input
                id="restaurant-phone"
                type="tel"
                autoComplete="tel"
                disabled={submitting}
                placeholder="Enter contact number"
                aria-invalid={!!errors.phoneNumber}
                className={`${inputBase} py-2 ${fieldRing(!!errors.phoneNumber)}`}
                {...register("phoneNumber", {
                  required: "Contact number is required.",
                })}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="restaurant-cuisine"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
              >
                <UtensilsCrossed
                  className="h-4 w-4 shrink-0 text-zinc-400"
                  aria-hidden
                />
                Cuisine Type <RequiredStar />
              </label>
              <select
                id="restaurant-cuisine"
                disabled={submitting}
                aria-invalid={!!errors.cuisineType}
                className={`${selectBase} ${fieldRing(!!errors.cuisineType)}`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                }}
                {...register("cuisineType", {
                  required: "Select a cuisine type.",
                })}
              >
                {CUISINE_OPTIONS.map((o) => (
                  <option key={o.value || "placeholder"} value={o.value} disabled={o.value === ""}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.cuisineType && (
                <p className="text-sm text-red-600">{errors.cuisineType.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="restaurant-email"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
              >
                <Mail className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                Email Address
              </label>
              <input
                id="restaurant-email"
                type="email"
                autoComplete="email"
                disabled={submitting}
                placeholder="Enter email address"
                aria-invalid={!!errors.email}
                className={`${inputBase} py-2 ${fieldRing(!!errors.email)}`}
                {...register("email", {
                  validate: (v) => {
                    const t = v.trim();
                    if (t.length === 0) return true;
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
                      ? true
                      : "Enter a valid email.";
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="flex max-w-sm flex-col gap-1.5">
            <label
              htmlFor="restaurant-description"
              className="flex w-fit max-w-full items-center gap-1.5 text-sm font-medium text-zinc-700"
            >
              <FileText className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
              Description
            </label>
            <textarea
              id="restaurant-description"
              disabled={submitting}
              placeholder="Enter a short description about the restaurant"
              aria-invalid={!!errors.description}
              className={`${textareaBase} w-full ${fieldRing(!!errors.description)}`}
              {...register("description")}
            />
          </div>

          <div className="flex flex-col gap-1.5 md:max-w-xl lg:max-w-2xl">
            <label
              htmlFor="restaurant-website"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
            >
              <Globe className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
              Website
            </label>
            <input
              id="restaurant-website"
              type="url"
              inputMode="url"
              disabled={submitting}
              placeholder="Enter website (optional)"
              aria-invalid={!!errors.websiteUrl}
              className={`${inputBase} py-2 ${fieldRing(!!errors.websiteUrl)}`}
              {...register("websiteUrl", { validate: optionalUrlRule })}
            />
            {errors.websiteUrl && (
              <p className="text-sm text-red-600">{errors.websiteUrl.message}</p>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
            <MapPin className="h-5 w-5 shrink-0 text-zinc-500" strokeWidth={2} aria-hidden />
            Location
          </h2>

          <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
            <div className="flex min-w-0 flex-col gap-1.5">
              <label
                htmlFor="city"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
              >
                <Landmark className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                City <RequiredStar />
              </label>
              <input
                id="city"
                type="text"
                disabled={submitting}
                placeholder="e.g. San Francisco"
                aria-invalid={!!errors.city}
                className={`${inputBase} min-w-0 py-2 ${fieldRing(!!errors.city)}`}
                {...register("city", { required: "City is required." })}
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-1.5">
              <label
                htmlFor="state"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
              >
                <MapPinned className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                State / Region <RequiredStar />
              </label>
              <input
                id="state"
                type="text"
                disabled={submitting}
                placeholder="e.g. CA"
                aria-invalid={!!errors.state}
                className={`${inputBase} min-w-0 py-2 ${fieldRing(!!errors.state)}`}
                {...register("state", { required: "State or region is required." })}
              />
              {errors.state && (
                <p className="text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-1.5">
              <label
                htmlFor="postal"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
              >
                <Hash className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                Postal / Zip <RequiredStar />
              </label>
              <input
                id="postal"
                type="text"
                autoComplete="postal-code"
                disabled={submitting}
                placeholder="e.g. 94102"
                aria-invalid={!!errors.postalCode}
                className={`${inputBase} min-w-0 py-2 ${fieldRing(!!errors.postalCode)}`}
                {...register("postalCode", {
                  required: "Postal or zip code is required.",
                })}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-600">{errors.postalCode.message}</p>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-1.5">
              <label
                htmlFor="country"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
              >
                <Flag className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                Country <RequiredStar />
              </label>
              <input
                id="country"
                type="text"
                autoComplete="country-name"
                disabled={submitting}
                placeholder="e.g. USA"
                aria-invalid={!!errors.country}
                className={`${inputBase} min-w-0 py-2 ${fieldRing(!!errors.country)}`}
                {...register("country", { required: "Country is required." })}
              />
              {errors.country && (
                <p className="text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
            <Images className="h-5 w-5 shrink-0 text-zinc-500" strokeWidth={2} aria-hidden />
            Additional Information
          </h2>

          <div className="max-w-md">
            <RestaurantLogoDropField
              id="restaurant-logo-file"
              label="Restaurant logo"
              labelIcon={ImageIcon}
              disabled={submitting}
              file={logoFile}
              error={logoFileError}
              onFile={setLogoFile}
            />
          </div>
        </section>

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

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            aria-label={submitting ? "Creating restaurant" : "Create restaurant"}
            className="group inline-flex h-12 w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-base font-medium text-white shadow-lg shadow-zinc-900/25 transition-all duration-200 ease-out hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <Loader2
                className="h-6 w-6 animate-spin text-white"
                strokeWidth={2.5}
                aria-hidden
              />
            ) : (
              <>
                <span>Create Restaurant</span>
                <Store
                  className="h-5 w-5 opacity-90 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden
                />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
