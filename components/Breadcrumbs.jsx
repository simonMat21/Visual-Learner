"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { findTopic } from "@/lib/topics";

const STATIC = {
  "/about": "About",
  "/privacy_policy": "Privacy Policy",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  const topic = findTopic(pathname);
  const trail = topic
    ? [
        { label: topic.subject.name, href: `/?tab=${topic.subject.id}` },
        { label: topic.group.title },
        { label: topic.name },
      ]
    : STATIC[pathname]
    ? [{ label: STATIC[pathname] }]
    : [];

  if (trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-6xl px-8 pt-6">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-ink-3">
        <li>
          <Link href="/" className="hover:text-ink transition-colors">
            Home
          </Link>
        </li>
        {trail.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-rule-strong">/</span>
            {c.href ? (
              <Link href={c.href} className="hover:text-ink transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className={i === trail.length - 1 ? "text-ink-2" : ""}>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
