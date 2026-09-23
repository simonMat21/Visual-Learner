// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Singular Value Decomposition (SVD)",
  description:
    "Visualize SVD as a rotation, a scaling and another rotation, with the U, Σ and Vᵀ matrices.",
  alternates: {
    canonical: "/math/matrix/SVD",
  },
  openGraph: {
    title: "Singular Value Decomposition (SVD) | Visual Learner",
    description:
      "Visualize SVD as a rotation, a scaling and another rotation, with the U, Σ and Vᵀ matrices.",
    url: "/math/matrix/SVD",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
