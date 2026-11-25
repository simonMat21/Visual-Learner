// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Queue Visualization",
  description:
    "Enqueue, dequeue and peek on an array-based queue step by step, and see why the simple array queue wastes slots.",
  alternates: {
    canonical: "/algorithms/stack-queue/queue",
  },
  openGraph: {
    title: "Queue Visualization | Visual Learner",
    description:
      "Enqueue, dequeue and peek on an array-based queue step by step, and see why the simple array queue wastes slots.",
    url: "/algorithms/stack-queue/queue",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
