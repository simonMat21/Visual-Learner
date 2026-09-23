// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Matrix Multiplication",
  description:
    "Step through matrix multiplication row by column with an interactive visualization.",
  alternates: {
    canonical: "/math/matrix/matrix-mult",
  },
  openGraph: {
    title: "Matrix Multiplication | Visual Learner",
    description:
      "Step through matrix multiplication row by column with an interactive visualization.",
    url: "/math/matrix/matrix-mult",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
