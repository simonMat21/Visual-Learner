// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Binary Search Visualization",
  description:
    "See binary search halve a sorted array's search range at each step, with an interactive animation and code.",
  alternates: {
    canonical: "/algorithms/search/binary-search",
  },
  openGraph: {
    title: "Binary Search Visualization | Visual Learner",
    description:
      "See binary search halve a sorted array's search range at each step, with an interactive animation and code.",
    url: "/algorithms/search/binary-search",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
