"use client";

import {
  getFormDesignStyle,
  getSplitImageColumnClass,
  getSplitShellExtraClass,
} from "@/app/components/crm-template-editor/form-designs/registry";
import {
  imageScaleStyle,
  normalizeImageScale,
} from "@/app/components/crm-template-editor/template-image";
import type { FormDesign } from "@/app/components/crm-template-editor/form-designs/types";

type SplitFormLayoutProps = {
  design: FormDesign;
  imageUrl: string;
  imageScale: number;
  children: React.ReactNode;
};

export function SplitFormLayout({
  design,
  imageUrl,
  imageScale,
  children,
}: SplitFormLayoutProps) {
  const v = getFormDesignStyle(design).splitVariant;
  const lightHeroCopy =
    v === "gradient" || v === "warm";
  const imgCol = getSplitImageColumnClass(design);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-lg shadow-zinc-900/10 ring-1 ring-black/[0.04] ${getSplitShellExtraClass(design)}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className={`relative ${imgCol}`}>
          {imageUrl.trim() ? (
            <>
              <img
                src={imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={imageScaleStyle(normalizeImageScale(imageScale))}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-12 bg-gradient-to-l from-black/10 to-transparent sm:block" />
            </>
          ) : (
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center ${
                lightHeroCopy ? "text-white" : "text-zinc-600"
              }`}
            >
              <span className="text-[0.65rem] font-semibold opacity-95">
                Hero area
              </span>
              <span
                className={`text-[0.6rem] ${lightHeroCopy ? "text-white/85" : "text-zinc-500"}`}
              >
                Add a photo for the full effect—layout works without one too.
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center space-y-4 bg-white p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
