// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Tarjan's Algorithm \u2013 Strongly Connected Components",
  description:
    "Watch Tarjan's algorithm find strongly connected components in one DFS using index, low-link values and a stack.",
  alternates: {
    canonical: "/algorithms/connectivity/tarjan",
  },
  openGraph: {
    title: "Tarjan's Algorithm \u2013 Strongly Connected Components | Visual Learner",
    description:
      "Watch Tarjan's algorithm find strongly connected components in one DFS using index, low-link values and a stack.",
    url: "/algorithms/connectivity/tarjan",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
