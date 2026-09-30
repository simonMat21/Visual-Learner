import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-rule bg-paper-2/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-8 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-board font-mono text-xs font-semibold text-chalk">
              VL
            </span>
            <span className="font-display text-lg font-semibold text-ink">Visual Learner</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-3">
            Free, interactive visual notes on algorithms, math and physics.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:items-end">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-2">
            <Link href="/" className="hover:text-ink transition-colors">Topics</Link>
            <Link href="/about" className="hover:text-ink transition-colors">About</Link>
            <Link href="/privacy_policy" className="hover:text-ink transition-colors">Privacy Policy</Link>
            <a
              href="https://github.com/simonMat21/Visual-Learner"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors"
            >
              GitHub
            </a>
          </nav>
          <p className="flex items-center gap-2 font-mono text-xs text-ink-3">
            Made with love
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Pink_Cockatoo.gif" alt="" width={20} height={20} className="h-5 w-5" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
