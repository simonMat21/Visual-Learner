"use client";

import { CodeBlock } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

const DOT = { green: "bg-pen-green", blue: "bg-pen-blue", rust: "bg-pen-rust", plum: "bg-pen-plum", gold: "bg-pen-gold" };
const NOTE = { green: "vl-note-green", blue: "vl-note-blue", rust: "vl-note-rust", plum: "vl-note-plum", gold: "vl-note-gold" };

/**
 * Shared layout for the algorithm pages: title, visualizer, explanation,
 * step cards, code, complexity, uses and limits. Same look as the hand-built
 * pages (vl-hero, vl-card, vl-note).
 *
 *   meta      [{ color, text }]                    chips under the title
 *   intro     JSX paragraphs for "What is …?"
 *   keyIdea   one sentence in the green box
 *   usage     [JSX] bullet points for "Using the visualizer"
 *   steps     [{ title, color, body }]             "How it works" cards
 *   code      { js, py, cpp, c, idea }             any subset
 *   time / space   [JSX] bullet points
 *   uses / limits  [JSX] bullet points
 */
export default function AlgoPage({
  title,
  meta = [],
  visualizer,
  whatTitle,
  intro,
  keyIdea,
  usage,
  stepsTitle = "How It Works",
  steps = [],
  note,
  code,
  codeHeight = "560px",
  time = [],
  space = [],
  uses = [],
  limits = [],
  usesTitle = "Where It Is Used",
}) {
  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">{title}</h1>
            <div className="vl-meta mt-3">
              {meta.map((m) => (
                <span key={m.text} className="flex items-center">
                  <span className={`w-2 h-2 ${DOT[m.color] || DOT.green} rounded-full mr-2`}></span>
                  {m.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card px-6 py-4">{visualizer}</div>
      </div>

      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">{whatTitle || `What is ${title}?`}</h2>
          <div className="space-y-4 text-ink-2 leading-relaxed text-lg">{intro}</div>
          {keyIdea && (
            <div className="vl-note vl-note-green p-4 mt-6">
              <p className="text-center text-lg font-bold text-pen-green">{keyIdea}</p>
            </div>
          )}
        </div>

        {usage && usage.length > 0 && (
          <div className="vl-card p-8">
            <h2 className="vl-h2 mb-4">Using the Visualizer</h2>
            <ul className="space-y-2 text-ink-2 leading-relaxed">
              {usage.map((u, i) => (
                <li key={i}>• {u}</li>
              ))}
            </ul>
          </div>
        )}

        {steps.length > 0 && (
          <div className="vl-card p-8">
            <h2 className="vl-h2 mb-6">{stepsTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps.map((s) => (
                <div key={s.title} className={`vl-note ${NOTE[s.color] || NOTE.plum} p-6`}>
                  <h3 className="vl-h3 mb-2">{s.title}</h3>
                  <div className="text-ink-2">{s.body}</div>
                </div>
              ))}
            </div>
            {note && <div className="vl-note vl-note-blue p-4 mt-6 text-ink-2">{note}</div>}
          </div>
        )}

        {code && (
          <div className="vl-card p-8">
            <h2 className="vl-h2 mb-6">Implementation</h2>
            <CodeBlock codeSnippets={code} defaultLang="js" height={codeHeight} />
          </div>
        )}

        {(time.length > 0 || space.length > 0) && (
          <div className="vl-card p-8">
            <h2 className="vl-h2 mb-6">Properties & Complexity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="vl-note vl-note-plum p-6">
                <h3 className="vl-h3 mb-2">Time Complexity</h3>
                <ul className="text-ink-2 space-y-2">
                  {time.map((t, i) => (
                    <li key={i}>• {t}</li>
                  ))}
                </ul>
              </div>
              <div className="vl-note vl-note-blue p-6">
                <h3 className="vl-h3 mb-2">Space & Properties</h3>
                <ul className="text-ink-2 space-y-2">
                  {space.map((t, i) => (
                    <li key={i}>• {t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {(uses.length > 0 || limits.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-card p-6">
              <h3 className="vl-h3 mb-4">
                <span>{usesTitle}</span>
              </h3>
              <ul className="text-ink-2 leading-relaxed space-y-2">
                {uses.map((t, i) => (
                  <li key={i}>• {t}</li>
                ))}
              </ul>
            </div>
            <div className="vl-card p-6">
              <h3 className="vl-h3 mb-4">
                <span>Limitations</span>
              </h3>
              <ul className="text-ink-2 leading-relaxed space-y-2">
                {limits.map((t, i) => (
                  <li key={i}>• {t}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <AdBanner position="bottom" size="responsive" adTest="off" adSlot="9575932649" />
        <div className="h-12"></div>
      </div>
    </main>
  );
}

/** Small helpers for page text. */
export const B = ({ c = "green", children }) => <span className={`text-pen-${c} font-semibold`}>{children}</span>;
export const M = ({ children }) => <span className="font-mono">{children}</span>;
