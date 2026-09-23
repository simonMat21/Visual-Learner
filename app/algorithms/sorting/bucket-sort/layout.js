// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Bucket Sort Visualization",
  description:
    "Watch bucket sort distribute values into buckets, sort each bucket and gather the result.",
  alternates: {
    canonical: "/algorithms/sorting/bucket-sort",
  },
  openGraph: {
    title: "Bucket Sort Visualization | Visual Learner",
    description:
      "Watch bucket sort distribute values into buckets, sort each bucket and gather the result.",
    url: "/algorithms/sorting/bucket-sort",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
