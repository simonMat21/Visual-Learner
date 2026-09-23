// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "About",
  description:
    "Learn about Visual Learner, a free platform that teaches algorithms, data structures, math and physics through interactive visualizations.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | Visual Learner",
    description:
      "Learn about Visual Learner, a free platform that teaches algorithms, data structures, math and physics through interactive visualizations.",
    url: "/about",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
