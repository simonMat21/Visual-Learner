// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Vector Subtraction",
  description:
    "Visualize vector subtraction as adding the opposite vector, with an interactive plot and code.",
  alternates: {
    canonical: "/math/vector/vector-subtraction",
  },
  openGraph: {
    title: "Vector Subtraction | Visual Learner",
    description:
      "Visualize vector subtraction as adding the opposite vector, with an interactive plot and code.",
    url: "/math/vector/vector-subtraction",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
