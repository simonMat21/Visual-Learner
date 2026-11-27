"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AdSense unit with a custom format. Same safety rules as AdBanner: request
 * once, only when the slot has a width, and collapse when Google returns
 * "unfilled" instead of leaving a blank box.
 */
const AdSense = ({
  adSlot,
  adFormat = "auto",
  adStyle = {},
  className = "",
  responsive = true,
  adTest = "off", // "on" only while testing
}) => {
  const wrapRef = useRef(null);
  const insRef = useRef(null);
  const [unfilled, setUnfilled] = useState(false);

  useEffect(() => {
    const ins = insRef.current;
    const wrap = wrapRef.current;
    if (!ins || !wrap || !adSlot) return undefined;

    const watcher = new MutationObserver(() => setUnfilled(ins.getAttribute("data-ad-status") === "unfilled"));
    watcher.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });

    let resize = null;
    const request = () => {
      if (ins.getAttribute("data-adsbygoogle-status")) return true;
      if (wrap.getBoundingClientRect().width < 1) return false;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error("AdSense error:", error);
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

  if (!adSlot) return null;

  return (
    <div ref={wrapRef} className={`adsense-container w-full ${unfilled ? "hidden" : ""} ${className}`}>
      <ins
        key={adSlot}
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center", width: adFormat === "auto" ? "100%" : "auto", ...adStyle }}
        data-ad-client="ca-pub-9246867260344606"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive.toString()}
        {...(adTest === "on" ? { "data-adtest": "on" } : {})}
      ></ins>
    </div>
  );
};

export default AdSense;
