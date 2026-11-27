// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Bellman-Ford Algorithm Visualizer",
  description:
    "Watch Bellman-Ford relax every edge pass by pass, handle negative weights and detect negative cycles, on a graph you build yourself.",
  alternates: {
    canonical: "/algorithms/shortest-path/bellman-ford",
  },
  openGraph: {
    title: "Bellman-Ford Algorithm Visualizer | Visual Learner",
    description:
      "Watch Bellman-Ford relax every edge pass by pass, handle negative weights and detect negative cycles, on a graph you build yourself.",
    url: "/algorithms/shortest-path/bellman-ford",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
