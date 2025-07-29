"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// ---------- ✅ CodeBlock Component (with tabs and fixed height) ----------
export function CodeBlock({ codeSnippets, defaultLang, height = "500px" }) {
  const languages = Object.keys(codeSnippets);
  const [activeLang, setActiveLang] = useState(defaultLang || languages[0]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippets[activeLang]);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: "10px",
        overflow: "hidden",
        fontSize: "0.95rem",
        fontFamily: "Fira Code, monospace",
        width: "100%",
        maxWidth: "800px",
        margin: "1.5rem auto",
        backgroundColor: "#1e1e1e",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        height: height, // fixed height
        overflowY: "auto",
      }}
    >
      {/* Language Tabs */}
      <div
        style={{
          display: "flex",
          background: "#151515",
          borderBottom: "1px solid #333",
        }}
      >
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveLang(lang)}
            style={{
              padding: "8px 14px",
              background: activeLang === lang ? "#272727" : "transparent",
              color: "#fff",
              border: "none",
              borderBottom:
                activeLang === lang
                  ? "2px solid #66d9ef"
                  : "2px solid transparent",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
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
              color: "#aaa",
              cursor: "pointer",
              fontSize: "0.8rem",
              padding: "8px",
            }}
            title="Copy code"
          >
            📋copy
          </button>
        </div>
      </div>

      {/* Fixed-height scrollable code display */}
      <div
        style={{
          maxHeight: height,
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
            background: "#1e1e1e",
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
        border: "1px solid #444",
        borderRadius: "8px",
        backgroundColor: "#1e1e1e",
        fontFamily: "Fira Code, monospace",
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
          background: "#1e1e1e",
        }}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
