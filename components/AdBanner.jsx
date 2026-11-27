"use client";

import { useEffect, useRef, useState } from "react";

const CLIENT = "ca-pub-9246867260344606";

/**
 * One AdSense display unit.
 *
 * - Requests the ad only once per <ins>, and only once its container has a
 *   real width (pushing into a 0-wide slot fails with "No slot size for
 *   availableWidth=0", and React dev mode runs effects twice).
 * - Uses the fully responsive "auto" format, which Google can fill far more
 *   often than a fixed "horizontal" shape.
 * - When Google answers "unfilled" (no ad to show), the whole block
 *   collapses instead of leaving an empty box on the page.
 */
const AdBanner = ({
  position = "top", // top, bottom, sidebar
  size = "responsive", // small, medium, large, responsive
  className = "",
  adSlot = "5174363643",
  adTest = "off", // "on" only while testing; never in production
}) => {
  const wrapRef = useRef(null);
  const insRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | filled | unfilled

  useEffect(() => {
    const ins = insRef.current;
    const wrap = wrapRef.current;
    if (!ins || !wrap) return undefined;

    // follow Google's verdict on this slot
    const readStatus = () => {
      const s = ins.getAttribute("data-ad-status");
      if (s === "filled") setStatus("filled");
      else if (s === "unfilled") setStatus("unfilled");
    };
    const watcher = new MutationObserver(readStatus);
    watcher.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
    readStatus();

    // request the ad once the slot has a width
    let resize = null;
    const request = () => {
      if (ins.getAttribute("data-adsbygoogle-status")) return true; // already requested
      if (wrap.getBoundingClientRect().width < 1) return false;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error("AdBanner error:", error);
      }
      return true;
    };
    if (!request()) {
      resize = new ResizeObserver(() => {
        if (request()) resize.disconnect();
      });
      resize.observe(wrap);
    }

    return () => {
      watcher.disconnect();
      resize?.disconnect();
    };
  }, [adSlot]);

  const fixed = {
    small: { width: "320px", height: "100px" },
    medium: { width: "728px", height: "90px" },
    large: { width: "970px", height: "250px" },
  }[size];

  const spacing = { top: "mb-8", bottom: "mt-8", sidebar: "mx-2" }[position] || "";

  return (
    <div
      ref={wrapRef}
      className={`ad-banner-container w-full ${status === "unfilled" ? "hidden" : `my-4 ${spacing}`} ${className}`}
      // keep a little room while loading so the page doesn't jump much when an ad arrives
      style={status === "loading" && !fixed ? { minHeight: "90px" } : undefined}
      aria-hidden={status !== "filled"}
    >
      <ins
        key={adSlot}
        ref={insRef}
        className="adsbygoogle"
        style={fixed ? { display: "inline-block", ...fixed } : { display: "block", width: "100%" }}
        data-ad-client={CLIENT}
        data-ad-slot={adSlot}
        {...(fixed ? {} : { "data-ad-format": "auto", "data-full-width-responsive": "true" })}
        {...(adTest === "on" ? { "data-adtest": "on" } : {})}
      ></ins>
    </div>
  );
};

export default AdBanner;
