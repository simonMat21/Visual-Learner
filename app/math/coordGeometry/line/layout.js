// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Line Equations",
  description:
    "Explore the general and slope-intercept forms of a straight line, including slope and intercepts, on an interactive graph.",
  alternates: {
    canonical: "/math/coordGeometry/line",
  },
  openGraph: {
    title: "Line Equations | Visual Learner",
    description:
      "Explore the general and slope-intercept forms of a straight line, including slope and intercepts, on an interactive graph.",
    url: "/math/coordGeometry/line",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
