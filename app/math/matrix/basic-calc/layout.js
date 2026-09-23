// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Basic Matrix Operations",
  description:
    "Add, subtract, scale and transpose matrices and find determinants with an interactive visualization.",
  alternates: {
    canonical: "/math/matrix/basic-calc",
  },
  openGraph: {
    title: "Basic Matrix Operations | Visual Learner",
    description:
      "Add, subtract, scale and transpose matrices and find determinants with an interactive visualization.",
    url: "/math/matrix/basic-calc",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
