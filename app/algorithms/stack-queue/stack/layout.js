// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Stack Visualization",
  description:
    "Push, pop and peek on an array-based stack step by step, and use a stack to check balanced brackets, with pseudocode and code.",
  alternates: {
    canonical: "/algorithms/stack-queue/stack",
  },
  openGraph: {
    title: "Stack Visualization | Visual Learner",
    description:
      "Push, pop and peek on an array-based stack step by step, and use a stack to check balanced brackets, with pseudocode and code.",
    url: "/algorithms/stack-queue/stack",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
