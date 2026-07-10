"use client";

import { useRouter, usePathname } from "next/navigation";

const SCROLL_TARGET_KEY = "sunscore-scroll-target";

interface ScrollNavButtonProps {
  targetId: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Scrolls to a landing-page section without ever touching the URL (no hash,
 * no query string). From another route it stashes the target in
 * sessionStorage and navigates home; ScrollToStoredTarget picks it up there.
 */
export function ScrollNavButton({ targetId, className, children }: ScrollNavButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleClick() {
    if (pathname === "/") {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem(SCROLL_TARGET_KEY, targetId);
      router.push("/");
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

export { SCROLL_TARGET_KEY };
