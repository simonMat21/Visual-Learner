"use client";

import React, { useState, useEffect } from "react";

const PhoneScreenBlock = ({
  message = "Change to desktop mode to view the website",
  linkText = null,
  linkUrl = null,
}) => {
  // State to track if device is mobile
  const [isMobile, setIsMobile] = useState(false); // default to false (or true based on your preference)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initialize on first client render
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll while the mobile overlay is shown
  useEffect(() => {
    // Prevent scrolling when mobile overlay is active
    if (isMobile) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    }

    // Restore body styles on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, [isMobile]);

  if (!isMobile) {
    return null; // Don't render on desktop
  }

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-hidden bg-paper p-6">
      <div className="w-full max-w-sm text-center">
        {/* Phone → desktop sketch */}
        <div className="mx-auto mb-8 flex items-end justify-center gap-4" aria-hidden="true">
          <div className="relative h-24 w-14 rounded-xl border-2 border-ink bg-card">
            <div className="absolute left-1/2 top-2 h-1 w-5 -translate-x-1/2 rounded-full bg-rule-strong" />
            <div className="absolute inset-x-2 bottom-3 top-5 rounded-md bg-board" />
          </div>
          <span className="mb-10 font-mono text-lg text-pen-rust animate-pulse">→</span>
          <div className="flex flex-col items-center">
            <div className="h-20 w-32 rounded-lg border-2 border-ink bg-card p-1.5">
              <div className="h-full w-full rounded bg-board" />
            </div>
            <div className="h-2 w-2 bg-ink" />
            <div className="h-1.5 w-14 rounded-sm bg-ink" />
          </div>
        </div>

        <p className="vl-eyebrow">Best on a bigger screen</p>
        <h1 className="vl-title mt-3 text-3xl leading-tight">{message}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-3">
          The chalkboard visualizations need room to move. Open this page on a laptop or desktop, or switch your
          browser to desktop mode.
        </p>

        {linkText && linkUrl && (
          <a href={linkUrl} className="dobtn mt-8 px-5">
            {linkText}
          </a>
        )}
      </div>
    </div>
  );
};

export default PhoneScreenBlock;
