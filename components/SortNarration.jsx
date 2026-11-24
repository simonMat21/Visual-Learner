"use client";

import { SORT_GUIDES } from "@/lib/sortPseudocode";

function LegendMark({ item }) {
  if (item.kind === "box-good")
    return <span className="inline-block h-4 w-4 rounded-sm border border-ink/30" style={{ background: "#7fd196" }} />;
  if (item.kind === "box-ring")
    return <span className="inline-block h-4 w-4 rounded-sm border-2" style={{ borderColor: "#2d7453" }} />;
  if (item.kind === "box-outline")
    return <span className="inline-block h-4 w-4 rounded-sm border-2" style={{ borderColor: "#d9a51f" }} />;
  return (
    <span className="rounded px-1.5 py-0.5 font-mono text-[11px] font-bold text-ink" style={{ background: "#f2c14e" }}>
      {item.text}
    </span>
  );
}

/**
 * Pseudocode with the running line lit up, plus a few counters and a legend.
 * Fed by the sketch's onNarrate callback (see lib/sortNarration.js).
 */
export default function SortNarration({ algo, state }) {
  const guide = SORT_GUIDES[algo];
  if (!guide) return null;
  const lines = state?.lines || [];
  const stats = state?.stats || {};

  return (
    <div className="mx-auto mt-3 flex w-full max-w-[1012px] flex-col gap-3 md:flex-row">
      <div className="min-w-0 flex-1 rounded-xl border border-rule bg-board px-4 py-3 text-chalk">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-chalk/60">Pseudocode</div>
        <pre className="font-mono text-[12.5px] leading-[1.55]">
          {guide.code.map((line, i) => {
            const active = lines.includes(i);
            return (
              <div
                key={i}
                className={`rounded px-2 transition-colors duration-150 ${
                  active ? "bg-[#f2c14e]/25 text-[#f2c14e]" : "text-chalk/75"
                }`}
              >
                <span className="mr-3 inline-block w-4 select-none text-right text-chalk/30">{i + 1}</span>
                {line}
              </div>
            );
          })}
        </pre>
      </div>

      <div className="flex shrink-0 flex-col gap-2 md:w-[270px]">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(guide.stats).map(([key, label]) => (
            <div key={key} className="rounded-lg border border-rule bg-card px-3 py-1.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">{label}</div>
              <div className="font-display text-lg font-semibold tabular-nums text-ink">{stats[key] ?? 0}</div>
            </div>
          ))}
        </div>

        {state?.done && (
          <div className="rounded-lg border border-pen-green/40 bg-paper px-3 py-1.5 text-sm font-semibold text-pen-green">
            Sorted!
          </div>
        )}

        {guide.legend.length > 0 && (
          <div className="flex flex-col gap-1.5 text-xs text-ink-2">
            {guide.legend.map((item) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <LegendMark item={item} />
                {item.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
