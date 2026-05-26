"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useFlowNavigationGuard(
  enabled: boolean,
  onBlocked: (href: string) => void,
) {
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) {
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathname) return;

      event.preventDefault();
      event.stopPropagation();
      onBlocked(`${url.pathname}${url.search}${url.hash}`);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [enabled, onBlocked, pathname]);
}
