// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Subtractive Color Mixing (Pigment)",
  description:
    "Mix cyan, magenta and yellow pigments and see how subtractive colour mixing works.",
  alternates: {
    canonical: "/physics/color-mixing-pigment",
  },
  openGraph: {
    title: "Subtractive Color Mixing (Pigment) | Visual Learner",
    description:
      "Mix cyan, magenta and yellow pigments and see how subtractive colour mixing works.",
    url: "/physics/color-mixing-pigment",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
