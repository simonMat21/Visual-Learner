// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Kosaraju's Algorithm \u2013 Strongly Connected Components",
  description:
    "Watch Kosaraju's two-pass algorithm find strongly connected components: DFS finish order, then DFS on the reversed graph.",
  alternates: {
    canonical: "/algorithms/connectivity/kosaraju",
  },
  openGraph: {
    title: "Kosaraju's Algorithm \u2013 Strongly Connected Components | Visual Learner",
    description:
      "Watch Kosaraju's two-pass algorithm find strongly connected components: DFS finish order, then DFS on the reversed graph.",
    url: "/algorithms/connectivity/kosaraju",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
