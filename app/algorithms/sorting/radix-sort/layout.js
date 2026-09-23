// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Radix Sort Visualization",
  description:
    "Visualize radix sort ordering numbers digit by digit, from least significant to most significant.",
  alternates: {
    canonical: "/algorithms/sorting/radix-sort",
  },
  openGraph: {
    title: "Radix Sort Visualization | Visual Learner",
    description:
      "Visualize radix sort ordering numbers digit by digit, from least significant to most significant.",
    url: "/algorithms/sorting/radix-sort",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
