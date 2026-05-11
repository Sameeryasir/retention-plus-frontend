"use client";

import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formDesignHidesTopHero } from "@/app/components/crm-template-editor/form-design-registry";
import { SignupFormFields } from "@/app/components/crm-template-editor/form-designs/SignupFormFields";
import { PaymentPagePreview } from "@/app/components/crm-template-editor/PaymentPagePreview";
import {
  imageScaleStyle,
  normalizeImageScale,
} from "@/app/components/crm-template-editor/template-image";
import type { SignUpTemplatePage, TemplatePage } from "@/app/components/crm-template-editor/template-types";
import { createCustomer } from "@/app/services/customer/create-customer";

// --- Preview chrome ---
// Borderless white card + soft shadow only (no outline rings on the phone preview).

function layoutShellClass(_layoutType: string) {
  return "max-w-full";
}

/** Outer “phone card” — `overflow-hidden` clips full-bleed hero to rounded corners. */
function previewOuterChrome(_pageId: string, _coloredByStep: boolean): string {
  return "overflow-hidden rounded-2xl bg-white shadow-sm";
}

function textAlign(layoutType: string) {
  if (layoutType === "centered") return "text-center";
  return "text-left";
}

function BodyBlock({
  body,
  layoutType,
  isMobile,
  centerBody = false,
}: {
  body: string;
  layoutType: string;
  isMobile: boolean;
  /** Signup preview: center body copy regardless of page layoutType. */
  centerBody?: boolean;
}) {
  const trimmed = body.trim();
  if (!trimmed) return null;
  const paras = trimmed.split(/\n\n+/).filter(Boolean);
  const useCenter = centerBody || layoutType === "centered";
  const center = useCenter ? "mx-auto max-w-prose" : "";
  return (
    <div
      className={`mt-8 space-y-4 text-zinc-600 ${isMobile ? "text-sm" : "text-[0.9375rem] leading-relaxed"} ${center}`}
    >
      {paras.map((p, i) => (
        <p key={i} className={useCenter ? "text-center" : ""}>
          {p.trim()}
        </p>
      ))}
    </div>
  );
}

function HeroImage({
  url,
  scale,
  variant = "inset",
}: {
  url: string;
  scale: number;
  /** `fullBleedTop` — edge-to-edge with card top/sides, taller frame (stacked + split preview). */
  variant?: "inset" | "fullBleedTop";
}) {
  const bleed = variant === "fullBleedTop";
  const frameClass = bleed
    ? "aspect-[4/3] w-full overflow-hidden rounded-t-2xl sm:aspect-[3/2]"
    : "aspect-[16/9] w-full overflow-hidden rounded-xl shadow-sm";

  if (!url?.trim()) {
    return (
      <div
        className={`flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-300 bg-zinc-100/90 px-4 text-center ${frameClass}`}
      >
        <span className="text-xs font-semibold text-zinc-600">
          Image placeholder
        </span>
        <span className="text-[0.65rem] text-zinc-500">
          Upload an image in the sidebar under Media
        </span>
      </div>
    );
  }
  return (
    <div className={frameClass}>
      <img
        src={url}
        alt=""
        className="h-full w-full object-cover"
        style={imageScaleStyle(normalizeImageScale(scale))}
      />
    </div>
  );
}

export function TemplatePreview({
  page,
  landingPage,
  landingCtaHref,
  signupNextHref,
  signupBackHref,
  interactiveForms = false,
  submitCustomerOnSignupNext = false,
  editorStepPreviewChrome = false,
}: {
  page: TemplatePage;
  landingPage: TemplatePage;
  landingCtaHref?: string;
  signupNextHref?: string;
  signupBackHref?: string;
  interactiveForms?: boolean;
  submitCustomerOnSignupNext?: boolean;
  /** Passed from CRM editor; preview card is borderless either way. */
  editorStepPreviewChrome?: boolean;
}) {
  const router = useRouter();
  const [signupSubmitting, setSignupSubmitting] = useState(false);

  const isMobile = true;
  const fromLanding = page.id === "signup";
  const layoutType = page.layoutType;
  const heroImageUrl = fromLanding ? landingPage.imageUrl : page.imageUrl;
  const heroImageScale = fromLanding
    ? landingPage.imageScale
    : page.imageScale;

  const shell = `${layoutShellClass(layoutType)} mx-auto w-full`;
  const previewFrameClass = previewOuterChrome(
    page.id,
    editorStepPreviewChrome,
  );
  const align = textAlign(layoutType);
  const signup =
    page.id === "signup" ? (page as SignUpTemplatePage) : null;
  const showTopHero =
    !signup || !formDesignHidesTopHero(signup.formDesign);
  const landingCtaAsLink =
    page.id === "landing" && landingCtaHref?.trim().length
      ? landingCtaHref.trim()
      : null;
  const signupNextAsLink =
    page.id === "signup" && signupNextHref?.trim().length
      ? signupNextHref.trim()
      : null;
  const signupBackAsLink =
    page.id === "signup" && signupBackHref?.trim().length
      ? signupBackHref.trim()
      : null;

  const signupSubmitFlow =
    Boolean(signup) &&
    interactiveForms &&
    submitCustomerOnSignupNext &&
    Boolean(signupNextAsLink);

  const onSignupCustomerSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!signupSubmitFlow || !signupNextAsLink) return;
      const fd = new FormData(e.currentTarget);
      const first = String(fd.get("firstName") ?? "").trim();
      const last = String(fd.get("lastName") ?? "").trim();
      const email = String(fd.get("email") ?? "").trim();
      const name = [first, last].filter(Boolean).join(" ").trim();
      if (!email) {
        toast.error("Please enter your email.");
        return;
      }
      if (!name) {
        toast.error("Please enter your name.");
        return;
      }
      setSignupSubmitting(true);
      try {
        await createCustomer({ name, email });
        toast.success("You're all set — continuing to payment.", {
          duration: 2400,
        });
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 1000);
        });
        router.push(signupNextAsLink);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Something went wrong.",
        );
      } finally {
        setSignupSubmitting(false);
      }
    },
    [signupSubmitFlow, signupNextAsLink, router],
  );

  const withSurface = (alignClass: string, children: React.ReactNode) => (
    <div className={shell}>
      <div className={`${previewFrameClass} p-4 ${alignClass}`}>{children}</div>
    </div>
  );

  if (page.id === "payment") {
    return withSurface(
      "text-left",
      <PaymentPagePreview
        page={page}
        landingPage={landingPage}
        interactive={interactiveForms}
      />,
    );
  }

  const stackedBody = (
    <>
      {showTopHero ? (
        <div className="-mx-4 -mt-4 mb-6">
          <HeroImage
            url={heroImageUrl}
            scale={heroImageScale}
            variant="fullBleedTop"
          />
        </div>
      ) : null}

      {!signup ? (
        <>
          <h1
            className={`font-bold tracking-tight text-zinc-900 ${isMobile ? "text-xl" : "text-2xl sm:text-3xl"}`}
          >
            {page.heading}
          </h1>
          <p
            className={`mt-5 font-bold text-zinc-700 ${isMobile ? "text-[15px] leading-snug" : "text-[17px] leading-snug"} ${layoutType === "centered" ? "mx-auto max-w-prose" : ""}`}
          >
            {page.subheading}
          </p>
        </>
      ) : null}

      {signup ? (
        signupSubmitFlow ? (
          <form className="contents" onSubmit={onSignupCustomerSubmit}>
            <BodyBlock
              body={page.body}
              layoutType={layoutType}
              isMobile={isMobile}
              centerBody
            />
            <div className="mt-6">
              <SignupFormFields
                fieldIds={signup.formFieldIds}
                design={signup.formDesign}
                imageUrl={heroImageUrl}
                imageScale={heroImageScale}
                interactive={interactiveForms}
                omitInteractiveForm
              />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {signupBackAsLink ? (
                <Link
                  href={signupBackAsLink}
                  className="inline-flex min-w-36 items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm ring-1 ring-zinc-950/5 transition hover:bg-zinc-50"
                >
                  {signup.navBackLabel}
                </Link>
              ) : (
                <button
                  type="button"
                  className="min-w-36 rounded-lg border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm ring-1 ring-zinc-950/5"
                >
                  {signup.navBackLabel}
                </button>
              )}
              <button
                type="submit"
                disabled={signupSubmitting}
                className="inline-flex min-w-36 items-center justify-center rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-black/10 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signup.navNextLabel}
              </button>
            </div>
          </form>
        ) : (
          <>
            <BodyBlock
              body={page.body}
              layoutType={layoutType}
              isMobile={isMobile}
              centerBody
            />
            <div className="mt-6">
              <SignupFormFields
                fieldIds={signup.formFieldIds}
                design={signup.formDesign}
                imageUrl={heroImageUrl}
                imageScale={heroImageScale}
                interactive={interactiveForms}
              />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {signupBackAsLink ? (
                <Link
                  href={signupBackAsLink}
                  className="inline-flex min-w-36 items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm ring-1 ring-zinc-950/5 transition hover:bg-zinc-50"
                >
                  {signup.navBackLabel}
                </Link>
              ) : (
                <button
                  type="button"
                  className="min-w-36 rounded-lg border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm ring-1 ring-zinc-950/5"
                >
                  {signup.navBackLabel}
                </button>
              )}
              {signupNextAsLink ? (
                <Link
                  href={signupNextAsLink}
                  className="inline-flex min-w-36 items-center justify-center rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-black/10 transition hover:bg-zinc-800"
                >
                  {signup.navNextLabel}
                </Link>
              ) : (
                <button
                  type="button"
                  className="min-w-36 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-black/10"
                >
                  {signup.navNextLabel}
                </button>
              )}
            </div>
          </>
        )
      ) : (
        <>
          <BodyBlock
            body={page.body}
            layoutType={layoutType}
            isMobile={isMobile}
          />
          <div className="mt-6 w-full">
            {landingCtaAsLink ? (
              <Link
                href={landingCtaAsLink}
                className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-black/10 transition hover:bg-zinc-800"
              >
                {page.buttonText}
              </Link>
            ) : (
              <button
                type="button"
                className="w-full rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-black/10"
              >
                {page.buttonText}
              </button>
            )}
          </div>
        </>
      )}
    </>
  );

  if (layoutType === "split") {
    return (
      <div className={shell}>
        <div
          className={`flex flex-col overflow-hidden ${previewFrameClass}`}
        >
          <div className="w-full min-w-0 shrink-0">
            <HeroImage
              url={heroImageUrl}
              scale={heroImageScale}
              variant="fullBleedTop"
            />
          </div>
          <div className="flex w-full flex-col justify-center p-4 text-left">
            {!signup ? (
              <>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                  {page.heading}
                </h1>
                <p className="mt-5 text-[15px] font-bold leading-snug text-zinc-700">
                  {page.subheading}
                </p>
              </>
            ) : null}
            <BodyBlock
              body={page.body}
              layoutType={signup ? layoutType : "stacked"}
              isMobile
              centerBody={Boolean(signup)}
            />
            {signup ? (
              signupSubmitFlow ? (
                <form className="contents" onSubmit={onSignupCustomerSubmit}>
                  <div className="mt-6 w-full min-w-0">
                    <SignupFormFields
                      fieldIds={signup.formFieldIds}
                      design={signup.formDesign}
                      imageUrl={heroImageUrl}
                      imageScale={heroImageScale}
                      interactive={interactiveForms}
                      omitInteractiveForm
                    />
                  </div>
                  <div className="mt-6 flex w-full max-w-md flex-wrap justify-center gap-2">
                    {signupBackAsLink ? (
                      <Link
                        href={signupBackAsLink}
                        className="inline-flex min-w-36 items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
                      >
                        {signup.navBackLabel}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="min-w-36 rounded-lg border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm"
                      >
                        {signup.navBackLabel}
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={signupSubmitting}
                      className="inline-flex min-w-36 items-center justify-center rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {signup.navNextLabel}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <BodyBlock
                    body={page.body}
                    layoutType={layoutType}
                    isMobile
                    centerBody
                  />
                  <div className="mt-6 w-full min-w-0">
                    <SignupFormFields
                      fieldIds={signup.formFieldIds}
                      design={signup.formDesign}
                      imageUrl={heroImageUrl}
                      imageScale={heroImageScale}
                      interactive={interactiveForms}
                    />
                  </div>
                  <div className="mt-6 flex w-full max-w-md flex-wrap justify-center gap-2">
                    {signupBackAsLink ? (
                      <Link
                        href={signupBackAsLink}
                        className="inline-flex min-w-36 items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
                      >
                        {signup.navBackLabel}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="min-w-36 rounded-lg border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm"
                      >
                        {signup.navBackLabel}
                      </button>
                    )}
                    {signupNextAsLink ? (
                      <Link
                        href={signupNextAsLink}
                        className="inline-flex min-w-36 items-center justify-center rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                      >
                        {signup.navNextLabel}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="min-w-36 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white"
                      >
                        {signup.navNextLabel}
                      </button>
                    )}
                  </div>
                </>
              )
            ) : landingCtaAsLink ? (
              <Link
                href={landingCtaAsLink}
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                {page.buttonText}
              </Link>
            ) : (
              <button
                type="button"
                className="mt-6 w-full rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white"
              >
                {page.buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return withSurface(align, stackedBody);
}
