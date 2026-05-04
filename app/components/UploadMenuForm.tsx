"use client";

import type { CreateMenuPayload } from "@/app/services/restaurant/upload-menu";
import {
  AlertCircle,
  FileText,
  Loader2,
  Type,
  Upload,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const inputBase =
  "h-11 w-full rounded-xl border bg-white px-4 text-[16px] leading-normal text-zinc-900 outline-none ring-zinc-900/0 transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-60";

const textareaBase =
  "min-h-[100px] w-full rounded-xl border bg-white px-4 py-3 text-[16px] leading-relaxed text-zinc-900 outline-none ring-zinc-900/0 transition placeholder:text-zinc-400 focus:ring-4 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-60";

const selectBase = `${inputBase} appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat py-2 pr-10`;

const MENU_TYPE_OPTIONS = [
  { value: "Breakfast", label: "Breakfast" },
  { value: "Brunch", label: "Brunch" },
  { value: "Lunch", label: "Lunch" },
  { value: "Dinner", label: "Dinner" },
  { value: "Late night", label: "Late night" },
  { value: "All day", label: "All day" },
] as const;

const ACCEPT_MENU = "application/pdf,image/png,image/jpeg,image/webp";
const MAX_MENU_BYTES = 10 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileKindLabel(mime: string): string {
  if (mime === "application/pdf") return "PDF";
  if (mime === "image/png") return "PNG";
  if (mime === "image/jpeg") return "JPG";
  if (mime === "image/webp") return "WEBP";
  return "File";
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

export type UploadMenuFormValues = {
  name: string;
  description: string;
  menuType: string;
};

export type UploadMenuFormProps = {
  restaurantId: number;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (payload: CreateMenuPayload) => Promise<void>;
};

function RequiredStar() {
  return <span className="text-red-500">*</span>;
}

function fieldRing(hasError: boolean) {
  return hasError
    ? "border-red-300 focus:border-red-400 focus:ring-red-900/10"
    : "border-zinc-200 focus:border-zinc-300";
}

type MenuDropProps = {
  id: string;
  disabled: boolean;
  file: File | null;
  error?: string;
  onFile: (file: File | null) => void;
};

function MenuFileDropField({ id, disabled, file, error, onFile }: MenuDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | undefined>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !isImageMime(file.type)) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

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
      const allowed = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
      if (!allowed.includes(f.type)) {
        setLocalError("Use PDF, PNG, JPG, or WEBP only.");
        if (inputEl) inputEl.value = "";
        return;
      }
      if (f.size > MAX_MENU_BYTES) {
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
        <FileText className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
        Menu file <RequiredStar />
      </label>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPT_MENU}
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
                <img
                  src={imagePreviewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-600">
                  <FileText className="h-7 w-7" aria-hidden strokeWidth={1.75} />
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
              Drag a new file here to replace
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
          <span className="text-sm font-medium text-zinc-700">Click to upload or drag and drop</span>
          <span className="text-xs text-zinc-500">PDF, PNG, JPG or WEBP (max 10MB)</span>
        </div>
      )}

      {(error ?? localError) ? (
        <p className="text-sm text-red-600">{error ?? localError}</p>
      ) : null}
    </div>
  );
}

export default function UploadMenuForm({
  restaurantId,
  submitting,
  errorMessage,
  onSubmit,
}: UploadMenuFormProps) {
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [menuFileError, setMenuFileError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadMenuFormValues>({
    defaultValues: {
      name: "",
      description: "",
      menuType: "Dinner",
    },
  });

  const submit = handleSubmit(async (data) => {
    setMenuFileError(undefined);
    if (!menuFile) {
      setMenuFileError("Choose a menu file to upload.");
      return;
    }

    const payload: CreateMenuPayload = {
      restaurantId,
      name: data.name.trim(),
      description: data.description.trim(),
      menuType: data.menuType,
      file: menuFile,
    };
    await onSubmit(payload);
  });

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm ring-1 ring-black/[0.03] sm:p-8">
      <form className="flex flex-col gap-6 font-sans" onSubmit={submit} noValidate>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="menu-name"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
          >
            <Type className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
            Menu name <RequiredStar />
          </label>
          <input
            id="menu-name"
            type="text"
            disabled={submitting}
            placeholder="e.g. Summer 2025"
            aria-invalid={!!errors.name}
            className={`${inputBase} py-2 ${fieldRing(!!errors.name)}`}
            {...register("name", {
              required: "Menu name is required.",
              maxLength: { value: 200, message: "Menu name must be 200 characters or less." },
            })}
          />
          {errors.name ? <p className="text-sm text-red-600">{errors.name.message}</p> : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="menu-description" className="text-sm font-medium text-zinc-700">
            Description <span className="font-normal text-zinc-500">(optional)</span>
          </label>
          <textarea
            id="menu-description"
            rows={3}
            disabled={submitting}
            placeholder="e.g. Seasonal items and drinks."
            aria-invalid={!!errors.description}
            className={`${textareaBase} ${fieldRing(!!errors.description)}`}
            {...register("description", {
              maxLength: { value: 2000, message: "Description must be 2000 characters or less." },
            })}
          />
          {errors.description ? (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="menu-type"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
          >
            <UtensilsCrossed className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
            Menu type <RequiredStar />
          </label>
          <select
            id="menu-type"
            disabled={submitting}
            aria-invalid={!!errors.menuType}
            className={`${selectBase} ${fieldRing(!!errors.menuType)}`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            }}
            {...register("menuType", { required: "Choose a menu type." })}
          >
            {MENU_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.menuType ? (
            <p className="text-sm text-red-600">{errors.menuType.message}</p>
          ) : null}
        </div>

        <MenuFileDropField
          id="menu-file"
          disabled={submitting}
          file={menuFile}
          error={menuFileError}
          onFile={setMenuFile}
        />

        {errorMessage ? (
          <div
            className="flex items-start gap-2 rounded-xl border border-red-200/80 bg-red-50/90 px-3 py-2.5 text-sm text-red-800"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        ) : null}

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            aria-label={submitting ? "Saving menu" : "Save menu"}
            className="group inline-flex h-12 w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-base font-medium text-white shadow-lg shadow-zinc-900/25 transition-all duration-200 ease-out hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" strokeWidth={2.5} aria-hidden />
            ) : (
              <>
                <span>Save menu</span>
                <Upload
                  className="h-5 w-5 opacity-90 transition-transform group-hover:-translate-y-0.5"
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
