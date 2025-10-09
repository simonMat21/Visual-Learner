"use client";

import { useEffect } from "react";

const AdSense = ({
  adSlot,
  adFormat = "auto",
  adStyle = {},
  className = "",
  responsive = true,
  adTest = "off", // Set to "on" for testing
}) => {
  useEffect(() => {
    try {
      // Initialize AdSense ads
      if (typeof window !== "undefined" && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          ...adStyle,
        }}
        data-ad-client="ca-pub-9246867260344606" // Replace with your publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive.toString()}
        data-adtest={adTest}
      ></ins>
    </div>
  );
};

export default AdSense;
