// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Vector Dot Product",
  description:
    "Explore the dot product (scalar product): its formula, the angle between vectors and its geometric meaning.",
  alternates: {
    canonical: "/math/vector/vector-dot-product",
  },
  openGraph: {
    title: "Vector Dot Product | Visual Learner",
    description:
      "Explore the dot product (scalar product): its formula, the angle between vectors and its geometric meaning.",
    url: "/math/vector/vector-dot-product",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
