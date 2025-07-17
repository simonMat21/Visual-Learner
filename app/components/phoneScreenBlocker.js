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

  // Listen for window resize events and manage body scroll
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

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

    // Cleanup event listener and body styles on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6 w-screen h-screen overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-20 animate-pulse -top-48 -left-48"></div>
        <div className="absolute w-80 h-80 bg-purple-500 rounded-full opacity-20 animate-pulse delay-1000 -bottom-40 -right-40"></div>
        <div className="absolute w-64 h-64 bg-indigo-500 rounded-full opacity-20 animate-pulse delay-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Animated icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-32 bg-white rounded-xl shadow-2xl animate-bounce">
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full"></div>
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="absolute top-8 bottom-16 left-2 right-2 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-red-500 rounded animate-ping"></div>
              </div>
            </div>
            {/* Desktop icon */}
            <div className="absolute -right-8 top-4 w-12 h-8 bg-white rounded-sm shadow-lg">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-300"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-300 rounded-sm"></div>
            </div>
            {/* Arrow */}
            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-white text-xl animate-pulse">
              →
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-white text-xl font-bold mb-6 leading-relaxed">
          {message}
        </h1>

        {/* Animated dots */}
        <div className="flex justify-center space-x-2 mb-8">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
        </div>

        {/* Optional link */}
        {linkText && linkUrl && (
          <a
            href={linkUrl}
            className="inline-block bg-white text-purple-900 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105"
          >
            {linkText}
          </a>
        )}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-ping top-1/4 left-1/4"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-ping delay-700 top-3/4 right-1/4"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-ping delay-1000 top-1/2 left-3/4"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-ping delay-300 top-1/3 right-1/3"></div>
      </div>
    </div>
  );
};

export default PhoneScreenBlock;
