// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Privacy Policy",
  description:
    "How Visual Learner collects, uses and protects your information, including cookies and advertising.",
  alternates: {
    canonical: "/privacy_policy",
  },
  openGraph: {
    title: "Privacy Policy | Visual Learner",
    description:
      "How Visual Learner collects, uses and protects your information, including cookies and advertising.",
    url: "/privacy_policy",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
