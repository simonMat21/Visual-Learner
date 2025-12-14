// robots.txt for SEO - Next.js automatically serves this at /robots.txt

export default function robots() {
  const baseUrl = "https://visuallearner.org"; // UPDATE THIS with your actual domain

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
