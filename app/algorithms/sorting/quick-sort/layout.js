// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Quick Sort Visualization",
  description:
    "Watch quick sort pick a pivot and partition the array recursively, with an interactive animation and code.",
  alternates: {
    canonical: "/algorithms/sorting/quick-sort",
  },
  openGraph: {
    title: "Quick Sort Visualization | Visual Learner",
    description:
      "Watch quick sort pick a pivot and partition the array recursively, with an interactive animation and code.",
    url: "/algorithms/sorting/quick-sort",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
