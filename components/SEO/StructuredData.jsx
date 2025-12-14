// JSON-LD Structured Data for SEO
// This helps Google understand your website better

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Visual Learner",
    url: "https://visuallearner.org", // UPDATE with your domain
    description:
      "Interactive visualizations for learning algorithms, data structures, mathematics, and physics.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://visuallearner.org/?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Visual Learner",
    url: "https://visuallearner.org", // UPDATE with your domain
    logo: "https://visuallearner.org/favicon.png",
    sameAs: [
      // Add your social media links here
      // "https://twitter.com/yourhandle",
      // "https://github.com/yourhandle",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function EducationalSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Visual Learner",
    description:
      "Free interactive platform for learning algorithms, data structures, and mathematics through visualization.",
    url: "https://visuallearner.org",
    areaServed: "Worldwide",
    teaches: [
      "Computer Science",
      "Algorithms",
      "Data Structures",
      "Mathematics",
      "Physics",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Use this for individual algorithm/topic pages
export function LearningResourceSchema({
  name,
  description,
  url,
  topic = "Computer Science",
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: name,
    description: description,
    url: url,
    learningResourceType: "Interactive Visualization",
    educationalLevel: "Beginner to Advanced",
    teaches: topic,
    isAccessibleForFree: true,
    inLanguage: "en",
    provider: {
      "@type": "Organization",
      name: "Visual Learner",
      url: "https://visuallearner.org",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
