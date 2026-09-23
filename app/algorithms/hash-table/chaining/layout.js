// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Hash Table Chaining",
  description:
    "Visualize collision resolution by separate chaining, where each bucket holds a list of entries.",
  alternates: {
    canonical: "/algorithms/hash-table/chaining",
  },
  openGraph: {
    title: "Hash Table Chaining | Visual Learner",
    description:
      "Visualize collision resolution by separate chaining, where each bucket holds a list of entries.",
    url: "/algorithms/hash-table/chaining",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
