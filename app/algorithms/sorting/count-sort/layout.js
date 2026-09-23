// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Counting Sort Visualization",
  description:
    "Watch counting sort tally each value and rebuild the array in order without comparing elements.",
  alternates: {
    canonical: "/algorithms/sorting/count-sort",
  },
  openGraph: {
    title: "Counting Sort Visualization | Visual Learner",
    description:
      "Watch counting sort tally each value and rebuild the array in order without comparing elements.",
    url: "/algorithms/sorting/count-sort",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
