"use client";

import { useEffect } from "react";

const AdBanner = ({
  position = "top", // top, bottom, sidebar
  size = "large", // small, medium, large, responsive
  className = "",
  adSlot,
  adTest = "off", // Set to "on" for testing
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          width: "320px",
          height: "100px",
        };
      case "medium":
        return {
          width: "728px",
          height: "90px",
        };
      case "large":
        return {
          width: "970px",
          height: "250px",
        };
      case "responsive":
      default:
        return {
          width: "100%",
          height: "auto",
          minHeight: "90px",
        };
    }
  };

  const getContainerStyles = () => {
    const baseStyles =
      "ad-banner-container flex justify-center items-center my-4";

    switch (position) {
      case "top":
        return `${baseStyles} mb-8`;
      case "bottom":
        return `${baseStyles} mt-8`;
      case "sidebar":
        return `${baseStyles} mx-2`;
      default:
        return baseStyles;
    }
  };

  useEffect(() => {
    try {
      // Initialize AdSense ads
      if (typeof window !== "undefined" && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdBanner error:", error);
    }
  }, []);

  return (
    <div className={`${getContainerStyles()} ${className}`}>
      <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-4 w-full max-w-full overflow-hidden">
        <div className="text-center mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Advertisement
          </span>
        </div>
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            ...getSizeStyles(),
          }}
          data-ad-client="ca-pub-9246867260344606" // Replace with your publisher ID
          data-ad-slot={adSlot}
          data-ad-format={size === "responsive" ? "auto" : "rectangle"}
          data-full-width-responsive={size === "responsive" ? "true" : "false"}
          data-adtest={adTest}
        ></ins>
      </div>
    </div>
  );
};

export default AdBanner;
