// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Function Graph Playground",
  description:
    "Type a function of x and plot it on the Cartesian plane in an interactive graphing playground.",
  alternates: {
    canonical: "/math/functions/graph-playground",
  },
  openGraph: {
    title: "Function Graph Playground | Visual Learner",
    description:
      "Type a function of x and plot it on the Cartesian plane in an interactive graphing playground.",
    url: "/math/functions/graph-playground",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
