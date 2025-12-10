"use client";

import React from "react";
import Link from "next/link";

const PrivacyPolicy = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-blue-300">Visual Learner</p>
          <p className="text-blue-400 text-sm mt-2">
            Last updated: {formattedDate}
          </p>
        </div>

        {/* Content */}
        <div className="bg-blue-900 bg-opacity-50 rounded-lg p-8 md:p-10 text-blue-50 space-y-8">
          {/* Welcome Section */}
          <section>
            <p className="text-lg leading-relaxed">
              Welcome to{" "}
              <a
                href="https://www.visuallearner.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 underline"
              >
                Visual Learner
              </a>
              . Your privacy is important to us. This Privacy Policy explains
              what information we do not collect, how we handle ads, and how we
              respect user rights.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Website Overview
            </h2>
            <p className="mb-4 leading-relaxed">
              Visual Learner allows users to visualize data science algorithms,
              physics concepts, and mathematical models in a simple, interactive
              way.
            </p>
            <p className="font-semibold text-white mb-3">
              The website is owned and managed by:
            </p>
            <ul className="space-y-2 ml-6 border-l-2 border-blue-400 pl-4">
              <li>
                <strong>Name:</strong> Simon Mattekkatt
              </li>
              <li>
                <strong>Location:</strong> Kerala, India
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:simonmatttekkatt21@gmail.com"
                  className="text-blue-300 hover:text-blue-200"
                >
                  simonmatttekkatt21@gmail.com
                </a>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Information We Collect
            </h2>
            <p className="mb-4 leading-relaxed">
              We value your privacy.{" "}
              <strong>
                Visual Learner does NOT collect, store, or process any personal
                information from users.
              </strong>
            </p>
            <p className="font-semibold text-white mb-3">This includes:</p>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-6">
              <li className="flex items-center">
                <span className="text-blue-300 mr-2">✗</span> No names
              </li>
              <li className="flex items-center">
                <span className="text-blue-300 mr-2">✗</span> No email addresses
              </li>
              <li className="flex items-center">
                <span className="text-blue-300 mr-2">✗</span> No device data
              </li>
              <li className="flex items-center">
                <span className="text-blue-300 mr-2">✗</span> No analytics
              </li>
              <li className="flex items-center">
                <span className="text-blue-300 mr-2">✗</span> No forms or
                submissions
              </li>
              <li className="flex items-center">
                <span className="text-blue-300 mr-2">✗</span> No log-in data
              </li>
              <li className="flex items-center">
                <span className="text-blue-300 mr-2">✗</span> No uploaded files
              </li>
              <li className="flex items-center">
                <span className="text-blue-300 mr-2">✗</span> No location
                tracking
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Cookies & Tracking
            </h2>
            <p className="mb-4 leading-relaxed">We do not use:</p>
            <ul className="grid gap-2 ml-6">
              <li className="flex items-center">
                <span className="text-blue-300 mr-2">✗</span> Cookies
              </li>
              <li className="flex items-center">
                <span className="text-blue-300 mr-2">✗</span> Tracking
                technologies
              </li>
              <li className="flex items-center">
                <span className="text-blue-300 mr-2">✗</span> Analytics services
                (e.g., Google Analytics)
              </li>
              <li className="flex items-center">
                <span className="text-blue-300 mr-2">✗</span> Third-party
                scripts (except Google AdSense)
              </li>
            </ul>
            <p className="mt-4 leading-relaxed">
              The only third-party system that may use cookies is Google
              AdSense, as described below.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Advertising (Google AdSense)
            </h2>
            <p className="mb-4 leading-relaxed">
              Visual Learner displays ads using Google AdSense.
            </p>
            <p className="mb-3 leading-relaxed">
              Google may use cookies such as:
            </p>
            <ul className="space-y-2 ml-6">
              <li>• DART cookie, which allows ads based on user interests</li>
              <li>• Other cookies required to display or limit repeated ads</li>
            </ul>
            <p className="mt-4 mb-4 leading-relaxed">
              These cookies are controlled entirely by Google, not by Visual
              Learner.
            </p>
            <p className="leading-relaxed">
              You can learn more or opt out at:{" "}
              <a
                href="https://www.google.com/policies/technologies/ads/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 underline"
              >
                https://www.google.com/policies/technologies/ads/
              </a>
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Third-Party Services
            </h2>
            <p className="mb-4 leading-relaxed">
              Aside from Google AdSense ads, we do not use any other third-party
              tools or services.
            </p>
            <p className="leading-relaxed">
              We do not share any data with third parties because we do not
              collect any in the first place.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              6. User Rights
            </h2>
            <p className="mb-4 leading-relaxed">
              Even though we do not collect personal data, Visual Learner
              remains committed to respecting global privacy rights such as:
            </p>
            <ul className="space-y-2 ml-6 mb-4">
              <li>• GDPR (EU)</li>
              <li>• CCPA/CPRA (California)</li>
              <li>• Indian IT privacy guidelines</li>
            </ul>
            <p className="font-semibold text-white mb-3">
              If any feature in the future requires data collection, we will:
            </p>
            <ul className="space-y-2 ml-6">
              <li>• Update this Privacy Policy clearly</li>
              <li>• Notify users before data collection begins</li>
              <li>• Request user consent when required</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Children&apos;s Privacy
            </h2>
            <p className="leading-relaxed">
              Visual Learner is safe for all ages. We do not knowingly collect
              any personal information from children or adults.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Data Stored
            </h2>
            <p className="leading-relaxed">
              Visual Learner stores no user data whatsoever on its servers.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              9. Links to External Sites
            </h2>
            <p className="leading-relaxed">
              Visual Learner may contain links to educational resources or
              external sites. We are not responsible for the content or privacy
              practices on those websites.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              10. Changes to This Privacy Policy
            </h2>
            <p className="leading-relaxed">
              We may occasionally update this Privacy Policy. Any changes will
              be posted here with a new &quot;Last Updated&quot; date.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              11. Contact Us
            </h2>
            <p className="mb-4 leading-relaxed">
              If you have any questions about this Privacy Policy, you can
              contact:
            </p>
            <div className="bg-blue-800 bg-opacity-50 rounded p-6 space-y-3">
              <p>
                <strong>Name:</strong> Simon Mattekkatt
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:simonmatttekkatt21@gmail.com"
                  className="text-blue-300 hover:text-blue-200"
                >
                  simonmatttekkatt21@gmail.com
                </a>
              </p>
              <p>
                <strong>Location:</strong> Kerala, India
              </p>
            </div>
          </section>
        </div>
        {/* Back to home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
