// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Vector Addition",
  description:
    "Visualize vector addition geometrically and component by component in an interactive plot.",
  alternates: {
    canonical: "/math/vector/vector-addition",
  },
  openGraph: {
    title: "Vector Addition | Visual Learner",
    description:
      "Visualize vector addition geometrically and component by component in an interactive plot.",
    url: "/math/vector/vector-addition",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
