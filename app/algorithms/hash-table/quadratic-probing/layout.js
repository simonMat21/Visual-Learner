// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Hash Table Quadratic Probing",
  description:
    "See quadratic probing resolve collisions with 1, 4, 9… offsets to reduce clustering.",
  alternates: {
    canonical: "/algorithms/hash-table/quadratic-probing",
  },
  openGraph: {
    title: "Hash Table Quadratic Probing | Visual Learner",
    description:
      "See quadratic probing resolve collisions with 1, 4, 9… offsets to reduce clustering.",
    url: "/algorithms/hash-table/quadratic-probing",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
