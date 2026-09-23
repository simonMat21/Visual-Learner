// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Damped Oscillation",
  description:
    "Visualize damped harmonic motion and see how the damping ratio and natural frequency shape the oscillation.",
  alternates: {
    canonical: "/physics/damping-function",
  },
  openGraph: {
    title: "Damped Oscillation | Visual Learner",
    description:
      "Visualize damped harmonic motion and see how the damping ratio and natural frequency shape the oscillation.",
    url: "/physics/damping-function",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
