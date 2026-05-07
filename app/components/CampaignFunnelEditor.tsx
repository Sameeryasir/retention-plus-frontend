"use client";

import { AlertCircle, ImagePlus, Pencil } from "lucide-react";
import { type ChangeEvent, useCallback, useMemo, useState } from "react";

export type CampaignFunnelEditorProps = {
  restaurantId: number;
  campaignId: number;
};

type FunnelPage = {
  id: string;
  label: string;
  pageTitle: string;
  headline: string;
  subheadline: string;
  body: string;
  ctaLabel: string;
  heroImageSrc?: string | null;
  signupFirstNameLabel: string;
  signupLastNameLabel: string;
  signupPhoneLabel: string;
};

const INITIAL_PAGES: FunnelPage[] = [
  {
    id: "landing",
    label: "Landing Page",
    pageTitle: "Union",
    headline: "Union Pub & Social",
    subheadline: "Special Daily Deal…",
    body: "BADGER BITES — JUST $4\n\nNormally $12 — You save $8 instantly (67% off).\n\nThat is $8 staying in your pocket — for real food, full sized, not a sample plate.\n\nGolden fried cheese curds — hot and oozing — piled high with sweet, smoky bacon jam that melts into every crispy edge, finished with cool ranch for the perfect dunk.\n\nShow up hungry. Walk out smiling. This deal is for today only while supplies last.\n\nCrunch. Melt. Sweet. Savory. Repeat.",
    ctaLabel: "Claim",
    signupFirstNameLabel: "",
    signupLastNameLabel: "",
    signupPhoneLabel: "",
  },
  {
    id: "signup",
    label: "Sign Up",
    pageTitle: "Sign up",
    headline: "Create your account",
    subheadline: "",
    body: "Enter your details so we can send your reward and reminders.",
    ctaLabel: "Continue",
    signupFirstNameLabel: "First name *",
    signupLastNameLabel: "Last name *",
    signupPhoneLabel: "Phone *",
  },
  {
    id: "prepay",
    label: "Prepay Offer",
    pageTitle: "Prepay",
    headline: "Lock in your price",
    subheadline: "",
    body: "Complete prepayment to secure this offer before it expires.",
    ctaLabel: "Pay now",
    signupFirstNameLabel: "",
    signupLastNameLabel: "",
    signupPhoneLabel: "",
  },
  {
    id: "payment",
    label: "Payment",
    pageTitle: "Payment",
    headline: "Payment details",
    subheadline: "",
    body: "Use a saved card or enter a new one to finish checkout.",
    ctaLabel: "Submit payment",
    signupFirstNameLabel: "",
    signupLastNameLabel: "",
    signupPhoneLabel: "",
  },
  {
    id: "confirmation",
    label: "Payment Confirmation",
    pageTitle: "Confirmation",
    headline: "You're all set",
    subheadline: "",
    body: "We sent a confirmation to your phone. Show your pass at the restaurant.",
    ctaLabel: "View pass",
    signupFirstNameLabel: "",
    signupLastNameLabel: "",
    signupPhoneLabel: "",
  },
];

function pageNeedsAttention(p: FunnelPage): boolean {
  if (p.id === "signup") {
    return (
      !p.signupFirstNameLabel.trim() ||
      !p.signupLastNameLabel.trim() ||
      !p.signupPhoneLabel.trim()
    );
  }
  if (
    !p.pageTitle.trim() ||
    !p.headline.trim() ||
    !p.body.trim() ||
    !p.ctaLabel.trim()
  ) {
    return true;
  }
  if (p.id === "landing" && !p.subheadline.trim()) return true;
  return false;
}

export default function CampaignFunnelEditor({
  restaurantId: _restaurantId,
  campaignId: _campaignId,
}: CampaignFunnelEditorProps) {
  const [pages, setPages] = useState<FunnelPage[]>(() =>
    INITIAL_PAGES.map((p) => ({ ...p })),
  );
  const [activePageId, setActivePageId] = useState(INITIAL_PAGES[0].id);

  const activePage = useMemo(
    () => pages.find((p) => p.id === activePageId) ?? pages[0],
    [pages, activePageId],
  );

  const updateActivePage = useCallback(
    (patch: Partial<FunnelPage>) => {
      setPages((prev) =>
        prev.map((p) =>
          p.id === activePageId ? { ...p, ...patch } : p,
        ),
      );
    },
    [activePageId],
  );

  const setLandingHeroImage = useCallback((src: string | null) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === "landing" ? { ...p, heroImageSrc: src } : p,
      ),
    );
  }, []);

  const handleLandingImageFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const out = reader.result;
        if (typeof out === "string") setLandingHeroImage(out);
      };
      reader.readAsDataURL(file);
    },
    [setLandingHeroImage],
  );

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-zinc-50 lg:flex-row lg:items-stretch">
      <aside className="flex min-h-0 w-full shrink-0 flex-col border-zinc-200 bg-white lg:w-64 lg:self-stretch lg:border-r">
        <nav
          className="flex min-h-0 flex-1 flex-col gap-1 p-3 pt-4 lg:p-4 lg:pt-5"
          aria-label="Funnel pages"
        >
          {pages.map((page, i) => {
            const selected = page.id === activePageId;
            const warn = pageNeedsAttention(page);
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => setActivePageId(page.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                  selected
                    ? "bg-zinc-900 text-white shadow-md ring-1 ring-zinc-900/20"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums ${
                    selected
                      ? "bg-white/15 text-white"
                      : "bg-zinc-200 text-zinc-700 group-hover:bg-zinc-300"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    className={`min-w-0 flex-1 truncate text-[0.8125rem] leading-snug ${
                      selected ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {page.label}
                  </span>
                  <Pencil
                    className={`size-3.5 shrink-0 ${
                      selected
                        ? "text-white/70"
                        : "text-zinc-400 group-hover:text-zinc-600"
                    }`}
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
                {warn ? (
                  <AlertCircle
                    className={`h-[1.125rem] w-[1.125rem] shrink-0 ${
                      selected ? "text-amber-300" : "text-amber-600"
                    }`}
                    strokeWidth={2}
                    aria-label="Incomplete fields"
                  />
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:min-h-0 lg:flex-row lg:items-stretch lg:gap-8">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Page settings
              </p>
              <div className="mt-4 space-y-4">
                {activePage.id !== "signup" ? (
                  <label className="block">
                    <span className="text-sm font-medium text-zinc-800">
                      Page title <span className="text-red-600">*</span>
                    </span>
                    <input
                      type="text"
                      value={activePage.pageTitle}
                      onChange={(e) =>
                        updateActivePage({ pageTitle: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/15"
                    />
                  </label>
                ) : null}
                {activePage.id === "landing" ? (
                  <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-zinc-800">
                          Hero image
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          Shown at the top of the landing preview for guests.
                        </p>
                      </div>
                      <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800">
                        <ImagePlus className="size-3.5" aria-hidden strokeWidth={2} />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleLandingImageFile}
                        />
                      </label>
                    </div>
                    {activePage.heroImageSrc ? (
                      <div className="mt-3 space-y-2">
                        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                          <img
                            src={activePage.heroImageSrc}
                            alt=""
                            className="h-28 w-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setLandingHeroImage(null)}
                          className="text-xs font-medium text-red-700 underline-offset-2 hover:underline"
                        >
                          Remove image
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {activePage.id === "landing" ? (
                  <>
                    <label className="block">
                      <span className="text-sm font-medium text-zinc-800">
                        Headline <span className="text-red-600">*</span>
                      </span>
                      <input
                        type="text"
                        value={activePage.headline}
                        onChange={(e) =>
                          updateActivePage({ headline: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/15"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-zinc-800">
                        Subheadline <span className="text-red-600">*</span>
                      </span>
                      <input
                        type="text"
                        value={activePage.subheadline}
                        onChange={(e) =>
                          updateActivePage({ subheadline: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/15"
                      />
                    </label>
                  </>
                ) : activePage.id === "signup" ? null : (
                  <label className="block">
                    <span className="text-sm font-medium text-zinc-800">
                      Headline <span className="text-red-600">*</span>
                    </span>
                    <textarea
                      value={activePage.headline}
                      onChange={(e) =>
                        updateActivePage({ headline: e.target.value })
                      }
                      rows={2}
                      className="mt-1.5 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/15"
                    />
                  </label>
                )}
                {activePage.id === "signup" ? (
                  <div className="space-y-4 rounded-lg bg-white p-4">
                    <label className="block">
                      <span className="text-sm font-medium text-zinc-800">
                        First name <span className="text-red-600">*</span>
                      </span>
                      <input
                        type="text"
                        value={activePage.signupFirstNameLabel}
                        onChange={(e) =>
                          updateActivePage({
                            signupFirstNameLabel: e.target.value,
                          })
                        }
                        placeholder="First name *"
                        className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/15"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-zinc-800">
                        Last name <span className="text-red-600">*</span>
                      </span>
                      <input
                        type="text"
                        value={activePage.signupLastNameLabel}
                        onChange={(e) =>
                          updateActivePage({
                            signupLastNameLabel: e.target.value,
                          })
                        }
                        placeholder="Last name *"
                        className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/15"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-zinc-800">
                        Phone number <span className="text-red-600">*</span>
                      </span>
                      <input
                        type="text"
                        value={activePage.signupPhoneLabel}
                        onChange={(e) =>
                          updateActivePage({
                            signupPhoneLabel: e.target.value,
                          })
                        }
                        placeholder="Phone *"
                        className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/15"
                      />
                    </label>
                  </div>
                ) : null}
                {activePage.id !== "signup" ? (
                  <>
                    <label className="block">
                      <span className="text-sm font-medium text-zinc-800">
                        Body copy <span className="text-red-600">*</span>
                      </span>
                      <textarea
                        value={activePage.body}
                        onChange={(e) =>
                          updateActivePage({ body: e.target.value })
                        }
                        rows={5}
                        className="mt-1.5 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/15"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-zinc-800">
                        Button label <span className="text-red-600">*</span>
                      </span>
                      <input
                        type="text"
                        value={activePage.ctaLabel}
                        onChange={(e) =>
                          updateActivePage({ ctaLabel: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/15"
                      />
                    </label>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 w-full shrink-0 flex-col self-stretch lg:w-[18.5rem]">
            <p className="mb-2 shrink-0 text-xs font-medium text-zinc-500">
              Preview
            </p>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-300 bg-zinc-900 shadow-lg ring-1 ring-black/10">
              <div className="border-b border-zinc-700 bg-zinc-900 px-2 py-1.5 text-center text-[0.6rem] font-medium text-zinc-400">
                Guest view · mobile
              </div>
              {activePage.id === "landing" ? (
                <div className="flex min-h-0 flex-1 flex-col bg-white">
                  <div className="min-h-[12rem] shrink-0 border-b-2 border-black bg-zinc-200 sm:min-h-[14rem] lg:min-h-[16rem]">
                    {activePage.heroImageSrc ? (
                      <img
                        src={activePage.heroImageSrc}
                        alt=""
                        className="min-h-[12rem] w-full object-cover sm:min-h-[14rem] lg:min-h-[16rem]"
                      />
                    ) : (
                      <div className="flex min-h-[12rem] flex-col items-center justify-center gap-1 bg-zinc-100 px-3 py-8 text-center text-[0.65rem] text-zinc-500 sm:min-h-[14rem] lg:min-h-[16rem]">
                        <span>Hero image</span>
                        <span className="text-zinc-400">Upload in Page settings</span>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 border-b border-zinc-100 px-4 py-4 text-center">
                    <p className="text-[0.95rem] font-bold leading-snug text-zinc-900">
                      {activePage.headline.trim() || "\u00a0"}
                    </p>
                    <p className="mt-1 text-xs font-medium leading-snug text-zinc-600">
                      {activePage.subheadline.trim() || "\u00a0"}
                    </p>
                  </div>
                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 text-center">
                    {activePage.body.split(/\n\n+/).map((para, i) => (
                      <p
                        key={i}
                        className={
                          i === 0
                            ? "text-[0.8rem] font-extrabold uppercase leading-snug tracking-wide text-zinc-900"
                            : "text-[0.7rem] leading-relaxed text-zinc-600"
                        }
                      >
                        {para.trim().split("\n").map((line, j) => (
                          <span key={j}>
                            {j > 0 ? <br /> : null}
                            {line}
                          </span>
                        ))}
                      </p>
                    ))}
                  </div>
                  <div className="mt-auto shrink-0 border-t border-zinc-200 bg-black px-4 py-3">
                    <p className="text-center text-sm font-semibold tracking-wide text-white">
                      {activePage.ctaLabel || "Claim"}
                    </p>
                  </div>
                </div>
              ) : activePage.id === "signup" ? (
                <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 bg-white p-4">
                  <div className="space-y-2 pt-1">
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left text-xs text-zinc-400">
                      {activePage.signupFirstNameLabel.trim() || "First name *"}
                    </div>
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left text-xs text-zinc-400">
                      {activePage.signupLastNameLabel.trim() || "Last name *"}
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-400">
                      <span className="text-base leading-none" aria-hidden>
                        🇺🇸
                      </span>
                      <span className="font-medium text-zinc-500">+1</span>
                      <span className="min-w-0 flex-1 truncate">
                        {activePage.signupPhoneLabel.trim() || "Phone *"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-auto w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white"
                  >
                    {activePage.ctaLabel || "…"}
                  </button>
                </div>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 bg-white p-4">
                  <p className="text-center text-sm font-semibold leading-snug text-zinc-900">
                    {activePage.headline || "…"}
                  </p>
                  {activePage.subheadline.trim() ? (
                    <p className="text-center text-xs font-medium leading-snug text-zinc-600">
                      {activePage.subheadline}
                    </p>
                  ) : null}
                  <p className="text-center text-xs leading-relaxed text-zinc-600">
                    {activePage.body || "…"}
                  </p>
                  <button
                    type="button"
                    className="mt-auto w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white"
                  >
                    {activePage.ctaLabel || "…"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
