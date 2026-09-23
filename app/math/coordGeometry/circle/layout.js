// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Circle Equations",
  description:
    "Explore the general and standard forms of a circle's equation, its centre and radius, on an interactive graph.",
  alternates: {
    canonical: "/math/coordGeometry/circle",
  },
  openGraph: {
    title: "Circle Equations | Visual Learner",
    description:
      "Explore the general and standard forms of a circle's equation, its centre and radius, on an interactive graph.",
    url: "/math/coordGeometry/circle",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
