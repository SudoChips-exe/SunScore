/**
 * Neither Inter nor Playfair Display ship the Naira glyph (U+20A6), so the
 * browser silently substitutes a mismatched system fallback font mid-number
 * no matter which font-family we force. Drawing it as a small inline SVG
 * (scaled in em units, colored via currentColor) makes it look identical
 * everywhere regardless of OS/font-fallback behavior.
 */
export function Naira({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={`inline-block h-[0.72em] w-[0.72em] align-[-0.05em] ${className}`}
    >
      <path
        d="M24 8 L24 92 L76 8 L76 92"
        fill="none"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path d="M8 35 H92 M8 60 H92" stroke="currentColor" strokeWidth="11" strokeLinecap="square" />
    </svg>
  );
}
