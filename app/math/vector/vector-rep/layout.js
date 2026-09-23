// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Vector Representation",
  description:
    "Visualize 2D vectors by magnitude and direction, and see their components change interactively.",
  alternates: {
    canonical: "/math/vector/vector-rep",
  },
  openGraph: {
    title: "Vector Representation | Visual Learner",
    description:
      "Visualize 2D vectors by magnitude and direction, and see their components change interactively.",
    url: "/math/vector/vector-rep",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
