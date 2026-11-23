"use client";

import {
  Gauge,
  Grid3x3,
  Pause,
  Play,
  RotateCcw,
  StepBack,
  StepForward,
} from "lucide-react";

const base =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors active:translate-y-px disabled:opacity-40 disabled:pointer-events-none hover:cursor-pointer";
const ghost = `${base} border-rule-strong bg-card text-ink hover:bg-paper-2`;
const primary = `${base} border-ink bg-ink text-chalk hover:bg-board-2 min-w-[96px]`;

/**
 * Playback bar that sits above the board, so the canvas only shows the graph.
 * `ui` comes from the sketch's player: { playing, speed, index, count, drawerOpen }.
 */
export default function MstToolbar({ ui, api, children }) {
  const atStart = ui.index <= 0;
  const atEnd = ui.index >= ui.count - 1;
  const progress = ui.count > 1 ? (ui.index / (ui.count - 1)) * 100 : 0;

  return (
    <div className="mx-auto mb-3 w-full max-w-[1012px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`${ghost} ${ui.drawerOpen ? "!bg-paper-2 !border-ink" : ""}`}
            onClick={() => api.current?.toggleDrawer()}
            aria-pressed={ui.drawerOpen}
            title="Edit the adjacency matrix"
          >
            <Grid3x3 size={16} />
            {ui.drawerOpen ? "Close matrix" : "Edit graph"}
          </button>
          {children}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className={ghost} onClick={() => api.current?.reset()} disabled={atStart} title="Back to the first step">
            <RotateCcw size={15} />
            Reset
          </button>
          <button type="button" className={ghost} onClick={() => api.current?.back()} disabled={atStart} title="Previous step (←)">
            <StepBack size={15} />
            Back
          </button>
          <button type="button" className={primary} onClick={() => api.current?.toggle()} title="Play / pause (space)">
            {ui.playing ? <Pause size={15} /> : <Play size={15} />}
            {ui.playing ? "Pause" : atEnd && ui.count > 1 ? "Replay" : "Play"}
          </button>
          <button type="button" className={ghost} onClick={() => api.current?.forward()} disabled={atEnd} title="Next step (→)">
            Step
            <StepForward size={15} />
          </button>
          <button type="button" className={`${ghost} w-[84px]`} onClick={() => api.current?.cycleSpeed()} title="Animation speed">
            <Gauge size={15} />
            {ui.speed}×
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div
          className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-paper-2"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const t = (e.clientX - r.left) / r.width;
            api.current?.go(Math.round(t * (ui.count - 1)));
          }}
          title="Jump to a step"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-pen-gold transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-mono text-xs text-ink-3 tabular-nums">
          {ui.count ? `${ui.index + 1} / ${ui.count}` : "–"}
        </span>
      </div>
    </div>
  );
}
