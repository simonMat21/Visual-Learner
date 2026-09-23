// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Additive Color Mixing (Light)",
  description:
    "Mix red, green and blue light and see how additive colour mixing produces every colour.",
  alternates: {
    canonical: "/physics/color-mixing-light",
  },
  openGraph: {
    title: "Additive Color Mixing (Light) | Visual Learner",
    description:
      "Mix red, green and blue light and see how additive colour mixing produces every colour.",
    url: "/physics/color-mixing-light",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
