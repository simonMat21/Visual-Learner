// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Hash Table Linear Probing",
  description:
    "Watch linear probing resolve collisions by scanning to the next free slot in the table.",
  alternates: {
    canonical: "/algorithms/hash-table/linear-probing",
  },
  openGraph: {
    title: "Hash Table Linear Probing | Visual Learner",
    description:
      "Watch linear probing resolve collisions by scanning to the next free slot in the table.",
    url: "/algorithms/hash-table/linear-probing",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
