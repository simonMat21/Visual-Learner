// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Linear Search Visualization",
  description:
    "Watch linear search scan an array element by element until it finds the target, with code.",
  alternates: {
    canonical: "/algorithms/search/linear-search",
  },
  openGraph: {
    title: "Linear Search Visualization | Visual Learner",
    description:
      "Watch linear search scan an array element by element until it finds the target, with code.",
    url: "/algorithms/search/linear-search",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
