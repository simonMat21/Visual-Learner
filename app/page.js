"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { subjects, allTopics } from "@/lib/topics";

const TABS = [...subjects.map((s) => ({ id: s.id, name: s.name })), { id: "logic", name: "Logic Design", soon: true }];
const PEN_TEXT = { rust: "text-pen-rust", blue: "text-pen-blue", green: "text-pen-green" };
const PEN_BG = { rust: "bg-pen-rust", blue: "bg-pen-blue", green: "bg-pen-green" };

/* A small, static chalkboard showing one bubble-sort comparison. */
function BoardIllustration() {
  const values = [12, 47, 31, 8, 56, 23];
  return (
    <div className="relative rounded-2xl border-[6px] border-board-2 bg-board p-6 shadow-[0_24px_50px_-28px_rgb(29_35_32/0.7)]">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-chalk/60">
        <span>bubble sort</span>
        <span>pass 2 · compare</span>
      </div>
      <div className="mt-8 flex items-end justify-center gap-3">
        {values.map((v, i) => {
          const active = i === 2 || i === 3;
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={`grid h-14 w-14 place-items-center rounded-md font-mono text-lg font-semibold text-ink ${
                  active ? "bg-chalk ring-[3px] ring-[#f2c14e] ring-offset-2 ring-offset-board" : "bg-chalk/90"
                }`}
              >
                {v}
              </div>
              <span className="font-mono text-[10px] text-chalk/40">{i}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 font-mono text-xs text-[#f2c14e]">
        <span>31 &gt; 8</span>
        <span className="text-chalk/50">→ swap</span>
      </div>
    </div>
  );
}

function TopicIndex() {
  const router = useRouter();
  const params = useSearchParams();
  const [activeTab, setActiveTab] = useState("algorithms");

  // ?tab= wins, then the last tab the visitor used
  useEffect(() => {
    const fromUrl = params.get("tab");
    let saved = null;
    try {
      saved = localStorage.getItem("activeTab");
    } catch {}
    const wanted = (fromUrl || saved || "algorithms").toLowerCase();
    const match = TABS.find((t) => t.id === wanted || t.name.toLowerCase() === wanted);
    setActiveTab(match ? match.id : "algorithms");
  }, [params]);

  const choose = (id) => {
    setActiveTab(id);
    try {
      localStorage.setItem("activeTab", id);
    } catch {}
    router.replace(`/?tab=${id}`, { scroll: false });
  };

  const subject = subjects.find((s) => s.id === activeTab);
  let counter = 0;

  return (
    <section id="topics" className="mx-auto max-w-6xl px-8">
      {/* Subject tabs */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule">
        <div role="tablist" aria-label="Subjects" className="-mb-px flex gap-1">
          {TABS.map((t) => {
            const active = t.id === activeTab;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => choose(t.id)}
                className={`relative rounded-t-lg border px-4 py-2.5 text-sm font-medium transition-colors sm:px-5 ${
                  active
                    ? "border-rule border-b-card bg-card text-ink"
                    : "border-transparent text-ink-3 hover:text-ink"
                }`}
              >
                {t.name}
                {t.soon && (
                  <span className="ml-2 rounded-full bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-3">
                    soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {subject && <p className="hidden pb-3 text-sm text-ink-3 md:block">{subject.blurb}</p>}
      </div>

      {/* Topic groups */}
      <div className="rounded-b-2xl border border-t-0 border-rule bg-card px-6 py-8 sm:px-10">
        {subject ? (
          <div className="space-y-12">
            {subject.groups.map((group) => (
              <div key={group.title}>
                <div className="mb-5 flex items-baseline gap-3">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{group.title}</h2>
                  <span className="font-mono text-xs text-ink-3">
                    {group.topics.length} {group.topics.length === 1 ? "topic" : "topics"}
                  </span>
                </div>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.topics.map((topic) => {
                    counter += 1;
                    return (
                      <li key={topic.href}>
                        <Link
                          href={topic.href}
                          className="group relative flex h-full flex-col rounded-xl border border-rule bg-paper/60 px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-rule-strong hover:bg-card hover:shadow-[0_12px_28px_-20px_rgb(29_35_32/0.45)]"
                        >
                          <span
                            className={`absolute inset-x-5 top-0 h-[2px] origin-left scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100 ${PEN_BG[subject.pen]}`}
                          />
                          <span className="flex items-center justify-between font-mono text-[11px] text-ink-3">
                            <span>{String(counter).padStart(2, "0")}</span>
                            <span
                              aria-hidden="true"
                              className={`translate-x-[-4px] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 ${PEN_TEXT[subject.pen]}`}
                            >
                              →
                            </span>
                          </span>
                          <span className="mt-2 font-display text-lg font-semibold leading-snug text-ink">
                            {topic.name}
                          </span>
                          <span className="mt-1 text-sm leading-snug text-ink-3">{topic.blurb}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md py-12 text-center">
            <p className="vl-eyebrow">In the works</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
              Logic Design is coming soon
            </h2>
            <p className="mt-3 text-ink-3">
              Gates, truth tables and circuits are being drawn up. In the meantime, the other subjects are ready to
              explore.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="vl-page pt-0">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-8 pb-14 pt-14 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div>
          <p className="vl-eyebrow">Interactive visual notes · {allTopics.length} topics</p>
          <h1 className="vl-title mt-4 text-5xl leading-[1.05] sm:text-6xl">
            Watch the idea <em className="font-medium italic text-pen-rust">move</em>, then it clicks.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
            Step through algorithms, data structures, math and physics on a live chalkboard. Feed in your own numbers,
            slow it down, and read the explanation and code alongside.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/algorithms/sorting/bubble-sort" className="dobtn px-5">
              Start with Bubble Sort
            </Link>
            <a href="#topics" className="dobtn-secondary px-5">
              Browse all topics
            </a>
          </div>
        </div>
        <BoardIllustration />
      </section>

      <Suspense fallback={null}>
        <TopicIndex />
      </Suspense>
    </main>
  );
}
