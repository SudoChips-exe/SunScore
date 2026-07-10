"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ScrollNavButton } from "@/components/ScrollNavButton";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.9 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.2 13 17.6 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.6c-.5 3-2.2 5.4-4.6 7.1l7.2 5.6c4.2-3.9 6.7-9.6 6.7-17.2Z" />
      <path fill="#FBBC05" d="M10.4 19.3a14.5 14.5 0 0 0 0 9.3l-7.8 6.1a24 24 0 0 1 0-21.5l7.8 6.1Z" />
      <path fill="#34A853" d="M24 48c6.3 0 11.9-2.1 15.9-5.6l-7.2-5.6c-2 1.4-4.7 2.2-8.7 2.2-6.4 0-11.8-3.5-13.7-8.9l-7.8 6.1C6.5 42.6 14.6 48 24 48Z" />
    </svg>
  );
}

export function SiteHeader() {
  const { user, loading, signIn, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  async function handleSignIn() {
    setBusy(true);
    try {
      await signIn();
    } catch (error) {
      console.error("[SunScore] Google sign-in failed:", error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="relative z-30 flex items-center justify-between px-6 py-5 md:px-10">
      <Link href="/" className="flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/favicon.svg" alt="SunScore" className="h-11 w-auto" />
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        <ScrollNavButton targetId="process" className="text-sm font-medium text-brand-stone-600 transition hover:text-brand-stone-900">
          How it works
        </ScrollNavButton>
        <Link href="/calculate" className="text-sm font-medium text-brand-stone-600 transition hover:text-brand-stone-900">
          Savings
        </Link>
        <ScrollNavButton targetId="comparison" className="text-sm font-medium text-brand-stone-600 transition hover:text-brand-stone-900">
          Compare
        </ScrollNavButton>
      </div>

      <div className="flex items-center gap-4">
        {loading ? null : user ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-brand-stone-600 transition hover:text-brand-stone-900"
            >
              Dashboard
            </Link>
            {user.photoURL && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt={user.displayName ?? "Account"} className="h-8 w-8 rounded-full" />
            )}
            <button
              onClick={() => signOut()}
              className="text-sm font-medium text-brand-stone-500 transition hover:text-brand-stone-900"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            disabled={busy}
            className="flex items-center gap-2 rounded-full border border-brand-stone-200 bg-white px-4 py-2 text-sm font-medium text-brand-stone-700 shadow-sm transition hover:shadow-md disabled:opacity-60"
          >
            <GoogleIcon />
            {busy ? "Signing in…" : "Sign in with Google"}
          </button>
        )}
      </div>
    </header>
  );
}
