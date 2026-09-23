// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Ellipse Equations",
  description:
    "Explore the equation of an ellipse, its standard form, foci and eccentricity on an interactive graph.",
  alternates: {
    canonical: "/math/coordGeometry/ellipse",
  },
  openGraph: {
    title: "Ellipse Equations | Visual Learner",
    description:
      "Explore the equation of an ellipse, its standard form, foci and eccentricity on an interactive graph.",
    url: "/math/coordGeometry/ellipse",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
