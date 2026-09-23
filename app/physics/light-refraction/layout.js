// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Light Refraction Through a Glass Block",
  description:
    "Watch light refract through a glass block and see how the refractive index changes its path, following Snell's law.",
  alternates: {
    canonical: "/physics/light-refraction",
  },
  openGraph: {
    title: "Light Refraction Through a Glass Block | Visual Learner",
    description:
      "Watch light refract through a glass block and see how the refractive index changes its path, following Snell's law.",
    url: "/physics/light-refraction",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
