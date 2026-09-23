// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Bubble Sort Visualization",
  description:
    "Watch bubble sort compare and swap adjacent elements step by step, with code in C, JavaScript and Python.",
  alternates: {
    canonical: "/algorithms/sorting/bubble-sort",
  },
  openGraph: {
    title: "Bubble Sort Visualization | Visual Learner",
    description:
      "Watch bubble sort compare and swap adjacent elements step by step, with code in C, JavaScript and Python.",
    url: "/algorithms/sorting/bubble-sort",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
