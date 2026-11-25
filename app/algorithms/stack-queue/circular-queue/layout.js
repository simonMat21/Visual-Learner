// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Circular Queue Visualization",
  description:
    "Watch a circular queue (ring buffer) wrap its front and rear indexes round with mod capacity, step by step with pseudocode.",
  alternates: {
    canonical: "/algorithms/stack-queue/circular-queue",
  },
  openGraph: {
    title: "Circular Queue Visualization | Visual Learner",
    description:
      "Watch a circular queue (ring buffer) wrap its front and rear indexes round with mod capacity, step by step with pseudocode.",
    url: "/algorithms/stack-queue/circular-queue",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
