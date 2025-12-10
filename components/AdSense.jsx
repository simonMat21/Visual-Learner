"use client";

import { useEffect } from "react";

const AdSense = ({
  adSlot,
  adFormat = "auto",
  adStyle = {},
  className = "",
  responsive = true,
  adTest = "off", // Set to "on" for testing during development
}) => {
  useEffect(() => {
    try {
      // Initialize AdSense ads - this pushes the ad to be rendered
      if (typeof window !== "undefined" && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [adSlot]); // Re-initialize if ad slot changes

  // Warn if ad slot is not provided
  if (!adSlot) {
    console.warn(
      "AdSense component: No adSlot provided. Please add a valid ad slot ID."
    );
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: "center",
          ...adStyle,
        }}
        data-ad-client="ca-pub-9246867260344606"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive.toString()}
        data-adtest={adTest}
      ></ins>
    </div>
  );
};

export default AdSense;
