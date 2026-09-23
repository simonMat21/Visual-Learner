// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Parabola Equations",
  description:
    "Explore the equation of a parabola and its standard form on an interactive graph.",
  alternates: {
    canonical: "/math/coordGeometry/parabola",
  },
  openGraph: {
    title: "Parabola Equations | Visual Learner",
    description:
      "Explore the equation of a parabola and its standard form on an interactive graph.",
    url: "/math/coordGeometry/parabola",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
