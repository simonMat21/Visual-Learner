// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Hash Table Visualization",
  description:
    "See how a hash function maps keys to slots, and insert, search and delete entries in a hash table.",
  alternates: {
    canonical: "/algorithms/hash-table",
  },
  openGraph: {
    title: "Hash Table Visualization | Visual Learner",
    description:
      "See how a hash function maps keys to slots, and insert, search and delete entries in a hash table.",
    url: "/algorithms/hash-table",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
