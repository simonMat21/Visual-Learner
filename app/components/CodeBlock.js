"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ codeSnippets, defaultLang }) {
  const languages = Object.keys(codeSnippets);
  const [activeLang, setActiveLang] = useState(defaultLang || languages[0]);

  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: "8px",
        overflow: "hidden",
        fontSize: "0.9rem",
        width: "70%",
        margin: "10px",
      }}
    >
      {/* Language Tabs */}
      <div style={{ display: "flex", background: "#1e1e1e" }}>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveLang(lang)}
            style={{
              padding: "8px 12px",
              background: activeLang === lang ? "#272727" : "transparent",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: activeLang === lang ? "bold" : "normal",
            }}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <SyntaxHighlighter
        language={activeLang}
        style={oneDark}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "#1e1e1e",
        }}
      >
        {codeSnippets[activeLang]}
      </SyntaxHighlighter>
    </div>
  );
}
