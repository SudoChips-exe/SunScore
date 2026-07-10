"use client";

import { useEffect } from "react";
import { SCROLL_TARGET_KEY } from "@/components/ScrollNavButton";

/** Consumes the section id stashed by ScrollNavButton on mount, then scrolls to it. */
export function ScrollToStoredTarget() {
  useEffect(() => {
    const targetId = sessionStorage.getItem(SCROLL_TARGET_KEY);
    if (!targetId) return;
    sessionStorage.removeItem(SCROLL_TARGET_KEY);
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  return null;
}
