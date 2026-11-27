// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Bor\u016fvka's Algorithm \u2013 Minimum Spanning Tree Visualizer",
  description:
    "Watch Bor\u016fvka's algorithm grow a minimum spanning tree in rounds: every component picks its cheapest outgoing edge, then they merge.",
  alternates: {
    canonical: "/algorithms/mst/boruvkas-algorithm",
  },
  openGraph: {
    title: "Bor\u016fvka's Algorithm \u2013 Minimum Spanning Tree Visualizer | Visual Learner",
    description:
      "Watch Bor\u016fvka's algorithm grow a minimum spanning tree in rounds: every component picks its cheapest outgoing edge, then they merge.",
    url: "/algorithms/mst/boruvkas-algorithm",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
