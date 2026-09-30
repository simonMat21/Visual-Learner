"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// ---------- ✅ CodeBlock Component (with tabs and fixed height) ----------
export function CodeBlock({ codeSnippets, defaultLang, height = "500px" }) {
  const languages = Object.keys(codeSnippets);
  const [activeLang, setActiveLang] = useState(defaultLang || languages[0]);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippets[activeLang]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #33443d",
        borderRadius: "14px",
        overflow: "hidden",
        fontSize: "0.95rem",
        fontFamily: "var(--font-mono), monospace",
        width: "100%",
        maxWidth: "800px",
        margin: "1.5rem auto",
        backgroundColor: "#1f2b26",
        boxShadow: "0 18px 40px -26px rgba(29,35,32,0.6)",
        height: height, // fixed height
      }}
    >
      {/* Language Tabs */}
      <div
        style={{
          display: "flex",
          background: "#25332d",
          borderBottom: "1px solid #33443d",
        }}
      >
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveLang(lang)}
            style={{
              padding: "8px 14px",
              background: activeLang === lang ? "#1f2b26" : "transparent",
              color: activeLang === lang ? "#f1ede2" : "#a9b4ae",
              border: "none",
              borderBottom:
                activeLang === lang
                  ? "2px solid #f2c14e"
                  : "2px solid transparent",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              fontFamily: "var(--font-mono), monospace",
              transition: "background 0.2s",
            }}
          >
            {lang.toUpperCase()}
          </button>
        ))}
        <div style={{ marginLeft: "auto", paddingRight: "10px" }}>
          <button
            onClick={copyToClipboard}
            style={{
              background: "transparent",
              border: "none",
              color: "#a9b4ae",
              fontFamily: "var(--font-mono), monospace",
              cursor: "pointer",
              fontSize: "0.8rem",
              padding: "8px",
            }}
            title="Copy code"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Fixed-height scrollable code display */}
      <div
        style={{
          height: `calc(${height} - 48px)`, // Subtract tab height
          overflowY: "auto",
        }}
      >
        <SyntaxHighlighter
          language={activeLang}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: "1.25rem 1.5rem",
            lineHeight: "1.6",
            fontSize: "0.85rem",
            background: "#1f2b26",
          }}
          wrapLongLines={true}
        >
          {codeSnippets[activeLang]}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// ---------- ✅ TextBox Component (no tabs, variable height) ----------
export function TextBox({ code, lang = "javascript" }) {
  return (
    <div
      style={{
        border: "1px solid #33443d",
        borderRadius: "8px",
        backgroundColor: "#1f2b26",
        fontFamily: "var(--font-mono), monospace",
        fontSize: "0.85rem",
        margin: "1rem auto",
        width: "100%",
        maxWidth: "800px",
        boxShadow: "0 0 5px rgba(0,0,0,0.2)",
      }}
    >
      <SyntaxHighlighter
        language={lang}
        style={atomDark}
        customStyle={{
          margin: 0,
          padding: "1rem 1.25rem",
          lineHeight: "1.6",
          background: "#1f2b26",
        }}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
