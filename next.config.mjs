/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Firebase's signInWithPopup needs to track the popup window across
        // origins (its own postMessage handshake with firebaseapp.com). The
        // browser's default COOP tears that popup down as untrackable,
        // which Firebase then reports as auth/popup-blocked.
        source: "/:path*",
        headers: [{ key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" }],
      },
    ];
  },
};

export default nextConfig;
