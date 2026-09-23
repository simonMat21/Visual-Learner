// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Eigenvalues and Eigenvectors",
  description:
    "Visualize how a matrix transforms space and find the eigenvectors that keep their direction.",
  alternates: {
    canonical: "/math/matrix/eigen-values",
  },
  openGraph: {
    title: "Eigenvalues and Eigenvectors | Visual Learner",
    description:
      "Visualize how a matrix transforms space and find the eigenvectors that keep their direction.",
    url: "/math/matrix/eigen-values",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
