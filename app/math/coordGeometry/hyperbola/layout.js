// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Hyperbola Equations",
  description:
    "Explore the equation of a hyperbola and its standard form on an interactive graph.",
  alternates: {
    canonical: "/math/coordGeometry/hyperbola",
  },
  openGraph: {
    title: "Hyperbola Equations | Visual Learner",
    description:
      "Explore the equation of a hyperbola and its standard form on an interactive graph.",
    url: "/math/coordGeometry/hyperbola",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
