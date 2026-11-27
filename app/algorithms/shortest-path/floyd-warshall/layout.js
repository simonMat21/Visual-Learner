// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Floyd-Warshall Algorithm Visualizer",
  description:
    "See Floyd-Warshall fill the all-pairs distance matrix one stop-over vertex at a time, with negative edges and negative-cycle detection.",
  alternates: {
    canonical: "/algorithms/shortest-path/floyd-warshall",
  },
  openGraph: {
    title: "Floyd-Warshall Algorithm Visualizer | Visual Learner",
    description:
      "See Floyd-Warshall fill the all-pairs distance matrix one stop-over vertex at a time, with negative edges and negative-cycle detection.",
    url: "/algorithms/shortest-path/floyd-warshall",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
