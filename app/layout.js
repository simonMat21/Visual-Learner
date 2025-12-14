import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import {
  WebsiteSchema,
  OrganizationSchema,
  EducationalSchema,
} from "@/components/SEO/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Visual Learner - Interactive Algorithm & Math Visualizations",
    template: "%s | Visual Learner",
  },
  description:
    "Learn algorithms, data structures, math concepts, and physics through interactive visualizations. Explore sorting, searching, graphs, trees, vectors, matrices, and more with hands-on animations.",
  keywords: [
    "algorithm visualization",
    "data structures",
    "sorting algorithms",
    "binary search tree",
    "graph algorithms",
    "heap visualization",
    "linked list",
    "hash table",
    "vector math",
    "matrix operations",
    "coordinate geometry",
    "physics simulations",
    "learn algorithms",
    "interactive learning",
    "computer science education",
    "programming tutorials",
    "bubble sort",
    "merge sort",
    "quick sort",
    "binary search",
    "BFS",
    "DFS",
    "Dijkstra's algorithm",
    "matrix multiplication",
    "vector addition",
    "educational platform",
    "visual learner",
    "DSA",
    "algorithm tutorials",
    "math visualizations",
    "physics learning",
    "algorithm visualizer",
    "data structure animations",
  ],
  authors: [{ name: "Visual Learner" }],
  creator: "Visual Learner",
  publisher: "Visual Learner",
  metadataBase: new URL("https://visuallearner.org"), // UPDATE THIS with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://visuallearner.org", // UPDATE THIS with your actual domain
    siteName: "Visual Learner",
    title: "Visual Learner - Interactive Algorithm & Math Visualizations",
    description:
      "Learn algorithms, data structures, math, and physics through interactive visualizations. Master sorting, searching, graphs, trees, vectors, and more.",
    images: [
      {
        url: "/og-image.png", // Create this image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: "Visual Learner - Algorithm Visualizations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visual Learner - Interactive Algorithm Visualizations",
    description:
      "Learn algorithms and data structures through interactive visualizations.",
    images: ["/og-image.png"], // Same as OpenGraph image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* Structured Data for SEO */}
        <WebsiteSchema />
        <OrganizationSchema />
        <EducationalSchema />

        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9246867260344606"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
