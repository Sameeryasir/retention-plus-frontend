"use client";

import { AlertCircle, Pencil } from "lucide-react";
import {
  type ChangeEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { CampaignFunnelLandingPhone } from "@/app/components/campaign-funnel/CampaignFunnelLandingPhone";
import { CampaignFunnelSignupPhone } from "@/app/components/campaign-funnel/CampaignFunnelSignupPhone";
import {
  INITIAL_PAGES,
  type FunnelPage,
  pageNeedsAttention,
} from "@/app/components/campaign-funnel/funnel-data";
import { ConfirmationFunnelPreview } from "@/app/components/campaign-funnel/ConfirmationFunnelPreview";
import {
  LandingHeroEditSidebar,
  type LandingSidebarSection,
} from "@/app/components/campaign-funnel/LandingHeroEditSidebar";
import {
  PaymentFunnelEditSidebar,
  type PaymentSidebarFocus,
} from "@/app/components/campaign-funnel/PaymentFunnelEditSidebar";
import { PaymentCheckoutPreviewMock } from "@/app/components/campaign-funnel/PaymentCheckoutPreviewMock";
import {
  SignupFunnelEditSidebar,
  type SignupSidebarFocus,
} from "@/app/components/campaign-funnel/SignupFunnelEditSidebar";

export type CampaignFunnelEditorProps = {
  restaurantId: number;
  campaignId: number;
};

export default function CampaignFunnelEditor({
  restaurantId: _restaurantId,
  campaignId: _campaignId,
}: CampaignFunnelEditorProps) {
  const [pages, setPages] = useState<FunnelPage[]>(() =>
    INITIAL_PAGES.map((p) => ({ ...p })),
  );
  const [activePageId, setActivePageId] = useState(INITIAL_PAGES[0].id);
  const [landingPreviewEditing, setLandingPreviewEditing] = useState(false);
  const [landingSidebarSection, setLandingSidebarSection] =
    useState<LandingSidebarSection>("hero");
  const [signupPreviewEditing, setSignupPreviewEditing] = useState(false);
  const [signupSidebarFocus, setSignupSidebarFocus] =
    useState<SignupSidebarFocus>("intro");
  const [paymentPreviewEditing, setPaymentPreviewEditing] = useState(false);
  const [paymentSidebarFocus, setPaymentSidebarFocus] =
    useState<PaymentSidebarFocus>("intro");

  const selectPage = useCallback((pageId: string) => {
    setActivePageId(pageId);
    if (pageId !== "landing") {
      setLandingPreviewEditing(false);
    }
    if (pageId !== "signup") {
      setSignupPreviewEditing(false);
    }
    if (pageId !== "payment") {
      setPaymentPreviewEditing(false);
      setPaymentSidebarFocus("intro");
    }
  }, []);

  const activePage = useMemo(
    () => pages.find((p) => p.id === activePageId) ?? pages[0],
    [pages, activePageId],
  );

  const landingPage = useMemo(
    () => pages.find((p) => p.id === "landing") ?? pages[0],
    [pages],
  );

  const isPreviewOnlyStep =
    activePage.id === "signup" ||
    activePage.id === "payment" ||
    activePage.id === "confirmation";

  const hideLeftSettingsColumn =
    isPreviewOnlyStep || activePage.id === "landing";

  // Landing pencil mode: dedicated hero/headline panel + tap-to-focus on the phone.
  const showLandingHeroSidebar =
    activePage.id === "landing" && landingPreviewEditing;

  const showSignupEditSidebar =
    activePage.id === "signup" && signupPreviewEditing;

  const showPaymentEditSidebar =
    activePage.id === "payment" && paymentPreviewEditing;

  const compactPreviewLayout =
    hideLeftSettingsColumn &&
    !showLandingHeroSidebar &&
    !showSignupEditSidebar &&
    !showPaymentEditSidebar;

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

  const ingestLandingHeroFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const out = reader.result;
        if (typeof out === "string") setLandingHeroImage(out);
      };
      reader.readAsDataURL(file);
    },
    [setLandingHeroImage],
  );

  const handleLandingImageFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (file) ingestLandingHeroFile(file);
    },
    [ingestLandingHeroFile],
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col bg-zinc-50 lg:flex-row lg:items-stretch">
      <aside className="flex min-h-0 w-full shrink-0 flex-col overflow-y-auto border-zinc-200 bg-white lg:w-64 lg:self-stretch lg:border-r">
        <nav
          className="flex min-h-0 flex-1 flex-col gap-1 p-3 pt-4 lg:p-4 lg:pt-5"
          aria-label="Funnel pages"
        >
          {pages.map((page, i) => {
            const selected = page.id === activePageId;
            const warn = pageNeedsAttention(page);
            const isLanding = page.id === "landing";
            const isSignup = page.id === "signup";
            const isPayment = page.id === "payment";

            if (isLanding) {
              return (
                <div
                  key={page.id}
                  className={`flex w-full items-stretch gap-0.5 rounded-xl p-0.5 transition ${
                    selected
                      ? "bg-zinc-900 text-white shadow-md ring-1 ring-zinc-900/20"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        activePageId === "landing" &&
                        landingPreviewEditing
                      ) {
                        setLandingPreviewEditing(false);
                        return;
                      }
                      selectPage(page.id);
                    }}
                    className={`group flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg px-2.5 py-3 text-left transition ${
                      selected ? "" : "hover:bg-transparent"
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
                      {warn ? (
                        <AlertCircle
                          className={`h-[1.125rem] w-[1.125rem] shrink-0 ${
                            selected ? "text-amber-300" : "text-amber-600"
                          }`}
                          strokeWidth={2}
                          aria-label="Incomplete fields"
                        />
                      ) : null}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={
                      selected && landingPreviewEditing
                        ? "Stop editing and view preview"
                        : "Edit landing page preview"
                    }
                    aria-pressed={selected && landingPreviewEditing}
                    onClick={() => {
                      if (activePageId !== "landing") {
                        selectPage("landing");
                        setLandingPreviewEditing(true);
                      } else {
                        setLandingPreviewEditing((v) => !v);
                      }
                    }}
                    className={`flex shrink-0 cursor-pointer items-center justify-center rounded-lg px-2.5 transition ${
                      selected && landingPreviewEditing
                        ? "bg-amber-400/25 text-amber-100 ring-1 ring-amber-300/40"
                        : selected
                          ? "text-white/80 hover:bg-white/10"
                          : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900"
                    }`}
                  >
                    <Pencil className="size-3.5" strokeWidth={2} />
                  </button>
                </div>
              );
            }

            if (isSignup) {
              return (
                <div
                  key={page.id}
                  className={`flex w-full items-stretch gap-0.5 rounded-xl p-0.5 transition ${
                    selected
                      ? "bg-zinc-900 text-white shadow-md ring-1 ring-zinc-900/20"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        activePageId === "signup" &&
                        signupPreviewEditing
                      ) {
                        setSignupPreviewEditing(false);
                        return;
                      }
                      selectPage(page.id);
                    }}
                    className={`group flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg px-2.5 py-3 text-left transition ${
                      selected ? "" : "hover:bg-transparent"
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
                      {warn ? (
                        <AlertCircle
                          className={`h-[1.125rem] w-[1.125rem] shrink-0 ${
                            selected ? "text-amber-300" : "text-amber-600"
                          }`}
                          strokeWidth={2}
                          aria-label="Incomplete fields"
                        />
                      ) : null}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={
                      selected && signupPreviewEditing
                        ? "Stop editing and view preview"
                        : "Edit sign up page preview"
                    }
                    aria-pressed={selected && signupPreviewEditing}
                    onClick={() => {
                      if (activePageId !== "signup") {
                        selectPage("signup");
                        setSignupPreviewEditing(true);
                      } else {
                        setSignupPreviewEditing((v) => !v);
                      }
                    }}
                    className={`flex shrink-0 cursor-pointer items-center justify-center rounded-lg px-2.5 transition ${
                      selected && signupPreviewEditing
                        ? "bg-amber-400/25 text-amber-100 ring-1 ring-amber-300/40"
                        : selected
                          ? "text-white/80 hover:bg-white/10"
                          : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900"
                    }`}
                  >
                    <Pencil className="size-3.5" strokeWidth={2} />
                  </button>
                </div>
              );
            }

            if (isPayment) {
              return (
                <div
                  key={page.id}
                  className={`flex w-full items-stretch gap-0.5 rounded-xl p-0.5 transition ${
                    selected
                      ? "bg-zinc-900 text-white shadow-md ring-1 ring-zinc-900/20"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        activePageId === "payment" &&
                        paymentPreviewEditing
                      ) {
                        setPaymentPreviewEditing(false);
                        return;
                      }
                      selectPage(page.id);
                    }}
                    className={`group flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg px-2.5 py-3 text-left transition ${
                      selected ? "" : "hover:bg-transparent"
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
                      {warn ? (
                        <AlertCircle
                          className={`h-[1.125rem] w-[1.125rem] shrink-0 ${
                            selected ? "text-amber-300" : "text-amber-600"
                          }`}
                          strokeWidth={2}
                          aria-label="Incomplete fields"
                        />
                      ) : null}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={
                      selected && paymentPreviewEditing
                        ? "Stop editing and view preview"
                        : "Edit payment page preview"
                    }
                    aria-pressed={selected && paymentPreviewEditing}
                    onClick={() => {
                      if (activePageId !== "payment") {
                        selectPage("payment");
                        setPaymentPreviewEditing(true);
                      } else {
                        setPaymentPreviewEditing((v) => !v);
                      }
                    }}
                    className={`flex shrink-0 cursor-pointer items-center justify-center rounded-lg px-2.5 transition ${
                      selected && paymentPreviewEditing
                        ? "bg-amber-400/25 text-amber-100 ring-1 ring-amber-300/40"
                        : selected
                          ? "text-white/80 hover:bg-white/10"
                          : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900"
                    }`}
                  >
                    <Pencil className="size-3.5" strokeWidth={2} />
                  </button>
                </div>
              );
            }

            return (
              <button
                key={page.id}
                type="button"
                onClick={() => selectPage(page.id)}
                className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
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

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <div
          className={`mx-auto flex min-h-0 w-full max-w-3xl flex-1 p-4 sm:p-6 ${
            compactPreviewLayout
              ? "flex-col items-center justify-center"
              : "flex-col gap-6 lg:flex-row lg:gap-8"
          }`}
        >
          {!hideLeftSettingsColumn ? (
            <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pb-4 lg:max-h-full lg:pb-2 lg:pr-1">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Page settings
                </p>
                <div className="mt-4 space-y-4">
                  {activePage.id !== "signup" && activePage.id !== "landing" ? (
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
                  {activePage.id !== "signup" && activePage.id !== "landing" ? (
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
                  ) : null}
                  {activePage.id !== "signup" &&
                  activePage.id !== "landing" ? (
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
          ) : null}

          <div
            className={
              compactPreviewLayout
                ? "w-full max-w-[20rem] shrink-0"
                : "w-full shrink-0 lg:min-h-0 lg:self-start lg:w-[18.5rem]"
            }
          >
            <div className="overflow-hidden rounded-2xl border-x border-zinc-300 border-y-0 bg-zinc-900 shadow-lg ring-1 ring-black/10">
              {activePage.id === "landing" ? (
                <CampaignFunnelLandingPhone
                  page={activePage}
                  editing={landingPreviewEditing}
                  heroEditInSidebar={showLandingHeroSidebar}
                  activeLandingSection={landingSidebarSection}
                  onSelectLandingSection={setLandingSidebarSection}
                  onPatch={updateActivePage}
                  onHeroFileChange={handleLandingImageFile}
                  onClearHero={() => setLandingHeroImage(null)}
                />
              ) : activePage.id === "signup" ? (
                <CampaignFunnelSignupPhone
                  signupPage={activePage}
                  landingPage={landingPage}
                  editing={signupPreviewEditing}
                  signupEditInSidebar={showSignupEditSidebar}
                  activeSignupFocus={signupSidebarFocus}
                  onSelectSignupFocus={setSignupSidebarFocus}
                  onPatch={updateActivePage}
                />
              ) : activePage.id === "payment" ? (
                <PaymentCheckoutPreviewMock
                  page={activePage}
                  heroImageSrc={landingPage.heroImageSrc}
                  editable={paymentPreviewEditing}
                  paymentEditInSidebar={showPaymentEditSidebar}
                  activePaymentFocus={paymentSidebarFocus}
                  onSelectPaymentFocus={setPaymentSidebarFocus}
                  onPatch={updateActivePage}
                />
              ) : activePage.id === "confirmation" ? (
                <ConfirmationFunnelPreview
                  page={activePage}
                  heroImageSrc={landingPage.heroImageSrc}
                />
              ) : (
                <div className="space-y-3 bg-white p-4">
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
                    className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white"
                  >
                    {activePage.ctaLabel || "…"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {showLandingHeroSidebar ? (
            <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pb-4 lg:max-h-full lg:pb-2 lg:pl-1">
              <LandingHeroEditSidebar
                page={activePage}
                activeSection={landingSidebarSection}
                onSelectSection={setLandingSidebarSection}
                onPatch={updateActivePage}
                onHeroFileChange={handleLandingImageFile}
                onClearHero={() => setLandingHeroImage(null)}
              />
            </div>
          ) : showSignupEditSidebar ? (
            <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pb-4 lg:max-h-full lg:pb-2 lg:pl-1">
              <SignupFunnelEditSidebar
                signupPage={activePage}
                activeFocus={signupSidebarFocus}
                onSelectFocus={setSignupSidebarFocus}
                onPatch={updateActivePage}
              />
            </div>
          ) : showPaymentEditSidebar ? (
            <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pb-4 lg:max-h-full lg:pb-2 lg:pl-1">
              <PaymentFunnelEditSidebar
                page={activePage}
                activeFocus={paymentSidebarFocus}
                onSelectFocus={setPaymentSidebarFocus}
                onPatch={updateActivePage}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
