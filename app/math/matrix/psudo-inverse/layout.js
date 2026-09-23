// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Moore–Penrose Pseudo-Inverse",
  description:
    "Compute the Moore–Penrose pseudo-inverse, the generalized inverse for non-square matrices, interactively.",
  alternates: {
    canonical: "/math/matrix/psudo-inverse",
  },
  openGraph: {
    title: "Moore–Penrose Pseudo-Inverse | Visual Learner",
    description:
      "Compute the Moore–Penrose pseudo-inverse, the generalized inverse for non-square matrices, interactively.",
    url: "/math/matrix/psudo-inverse",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
