"use client";

import { Gauge, Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";

const btn =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors active:translate-y-px disabled:opacity-40 disabled:pointer-events-none hover:cursor-pointer";
export const ghostBtn = `${btn} border-rule-strong bg-card text-ink hover:bg-paper-2`;
export const solidBtn = `${btn} border-ink bg-ink text-chalk hover:bg-board-2`;

/** First step / back / play-pause / step / speed, driven by a createPlayer() api ref. */
export function PlaybackButtons({ ui, api }) {
  const atStart = ui.index <= 0;
  const atEnd = ui.index >= ui.count - 1;
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" className={ghostBtn} onClick={() => api.current?.reset()} disabled={atStart} title="First step" aria-label="First step">
        <RotateCcw size={15} />
      </button>
      <button type="button" className={ghostBtn} onClick={() => api.current?.back()} disabled={atStart} title="Previous step (←)" aria-label="Previous step">
        <StepBack size={15} />
      </button>
      <button type="button" className={`${solidBtn} min-w-[88px]`} onClick={() => api.current?.toggle()} disabled={ui.count === 0} title="Play / pause (space)">
        {ui.playing ? <Pause size={15} /> : <Play size={15} />}
        {ui.playing ? "Pause" : "Play"}
      </button>
      <button type="button" className={ghostBtn} onClick={() => api.current?.forward()} disabled={atEnd} title="Next step (→)" aria-label="Next step">
        <StepForward size={15} />
      </button>
      <button type="button" className={`${ghostBtn} w-[70px]`} onClick={() => api.current?.cycleSpeed()} title="Animation speed">
        <Gauge size={15} />
        {ui.speed}×
      </button>
    </div>
  );
}

/** Operation name, a clickable progress bar and "step / total". */
export function StepProgress({ ui, api, label }) {
  const progress = ui.count > 1 ? (ui.index / (ui.count - 1)) * 100 : 0;
  return (
    <div className="mx-auto mb-3 flex w-full max-w-[1012px] items-center gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">{label}</span>
      <div
        className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-paper-2"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          api.current?.go(Math.round(((e.clientX - r.left) / r.width) * (ui.count - 1)));
        }}
        title="Jump to a step"
      >
        <div className="absolute inset-y-0 left-0 rounded-full bg-pen-gold transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>
      <span className="font-mono text-xs tabular-nums text-ink-3">{ui.count ? `${ui.index + 1} / ${ui.count}` : "–"}</span>
    </div>
  );
}
