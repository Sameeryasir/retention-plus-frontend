"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  loadFunnelTemplatePagesAsync,
  saveFunnelTemplatePagesAsync,
} from "@/app/components/crm-template-editor/funnel-template-storage";
import { INITIAL_TEMPLATE_PAGES } from "@/app/components/crm-template-editor/template-data";
import { TemplateEditorSidebar } from "@/app/components/crm-template-editor/TemplateEditorSidebar";
import { TemplatePageList } from "@/app/components/crm-template-editor/TemplatePageList";
import { TemplatePreview } from "@/app/components/crm-template-editor/TemplatePreview";
import type {
  TemplatePage,
  TemplatePageId,
  TemplatePagePatch,
  TemplatePagesState,
} from "@/app/components/crm-template-editor/template-types";

function clonePages(): TemplatePagesState {
  return JSON.parse(JSON.stringify(INITIAL_TEMPLATE_PAGES)) as TemplatePagesState;
}

export type CrmTemplateEditorProps = {
  restaurantId?: number;
  campaignId?: number;
  initialPageId?: TemplatePageId;
  interactivePreview?: boolean;
};

export function CrmTemplateEditor({
  restaurantId: _restaurantId,
  campaignId: _campaignId,
  initialPageId = "landing",
  interactivePreview = false,
}: CrmTemplateEditorProps) {
  const [pages, setPages] = useState<TemplatePagesState>(clonePages);
  const [activeId, setActiveId] = useState<TemplatePageId>(initialPageId);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [didHydrateStorage, setDidHydrateStorage] = useState(
    _campaignId == null,
  );

  const activePage = pages[activeId];

  useEffect(() => {
    if (_campaignId == null) {
      setPages(clonePages());
      setDidHydrateStorage(true);
      return;
    }
    setDidHydrateStorage(false);
    let cancelled = false;
    void (async () => {
      const loaded = await loadFunnelTemplatePagesAsync(String(_campaignId));
      if (cancelled) return;
      setPages(loaded ?? clonePages());
      setDidHydrateStorage(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [_campaignId]);

  useEffect(() => {
    if (!didHydrateStorage || _campaignId == null) return;
    const t = window.setTimeout(() => {
      void saveFunnelTemplatePagesAsync(String(_campaignId), pages);
    }, 320);
    return () => window.clearTimeout(t);
  }, [pages, _campaignId, didHydrateStorage]);

  const previewSignupNextHref =
    interactivePreview && _campaignId != null
      ? `/funnel/${encodeURIComponent(String(_campaignId))}/payment`
      : undefined;
  const previewSignupBackHref =
    interactivePreview && _campaignId != null
      ? `/funnel/${encodeURIComponent(String(_campaignId))}/landing`
      : undefined;

  const pageList = useMemo(
    () =>
      (Object.keys(pages) as TemplatePageId[]).map((id) => ({
        id,
        label: pages[id].label,
      })),
    [pages],
  );

  const patchPage = useCallback((patch: TemplatePagePatch) => {
    setPages((prev) => {
      const updated = { ...prev[activeId], ...patch } as TemplatePage;
      const next: TemplatePagesState = {
        ...prev,
        [activeId]: updated,
      };
      if (activeId === "landing") {
        const L = next.landing;
        next.signup = {
          ...next.signup,
          imageUrl: L.imageUrl,
          imageScale: L.imageScale,
        } as TemplatePage;
        next.payment = {
          ...next.payment,
          imageUrl: L.imageUrl,
          imageScale: L.imageScale,
        } as TemplatePage;
      }
      return next;
    });
  }, [activeId]);

  const openEditorForPage = useCallback((id: TemplatePageId) => {
    setActiveId(id);
    setSidebarOpen(true);
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-zinc-100 text-zinc-900">
      <header className="flex h-14 shrink-0 items-center border-b border-zinc-200 bg-white px-4 shadow-sm">
        <h1 className="truncate text-sm font-semibold sm:text-base">
          {activePage.label}
        </h1>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex min-h-0 w-[min(100%,20rem)] shrink-0 flex-col border-r border-zinc-200 bg-white shadow-sm">
          <TemplatePageList
            pages={pageList}
            activeId={activeId}
            onSelect={setActiveId}
            onEditPage={openEditorForPage}
          />
          {sidebarOpen ? (
            <>
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2">
                <span className="truncate text-xs font-semibold text-zinc-700">
                  Editing: {activePage.label}
                </span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="shrink-0 cursor-pointer rounded-md px-2 py-1 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200/80 hover:text-zinc-900"
                >
                  Done
                </button>
              </div>
              <TemplateEditorSidebar
                key={activeId}
                page={activePage}
                onChange={patchPage}
              />
            </>
          ) : (
            <div className="min-h-0 flex-1 border-t border-zinc-100 bg-white" />
          )}
        </aside>

        <main
          className={`relative min-h-0 min-w-0 flex-1 overflow-y-auto bg-zinc-100/90 p-4 sm:p-6 ${
            interactivePreview
              ? "flex flex-col justify-center"
              : ""
          }`}
        >
          <div className="mx-auto w-full max-w-[390px] shrink-0">
            <TemplatePreview
              page={activePage}
              landingPage={pages.landing}
              interactiveForms={interactivePreview}
              signupNextHref={previewSignupNextHref}
              signupBackHref={previewSignupBackHref}
              editorStepPreviewChrome
            />
          </div>
        </main>
      </div>
    </div>
  );
}
