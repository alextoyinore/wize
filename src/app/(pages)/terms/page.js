'use client'

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-black dark:text-white space-y-6">
      <h1 className="text-3xl font-bold">Terms and Conditions</h1>
      <p><strong>Effective Date:</strong> May 17, 2025</p>
      <p><strong>Last Updated:</strong> May 17, 2025</p>

      <section>
        <h2 className="text-xl font-semibold">1. Definitions</h2>
        <p>
          <strong>"Uwise"</strong> refers to Uwise Education, its agents,
          employees, and affiliates.
          <br />
          <strong>"Platform"</strong> means our LMS, website, and services.
          <br />
          <strong>"User"</strong> means anyone using our platform.
          <br />
          <strong>"Content"</strong> refers to course materials, videos, documents, etc.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">2. Eligibility</h2>
        <ul className="list-disc list-inside">
          <li>You must be at least 16 years old.</li>
          <li>If under 18, parental/guardian consent is required.</li>
          <li>You must provide accurate registration details.</li>
          <li>You agree to comply with NDPR and all applicable laws.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">3. User Account</h2>
        <p>
          You are responsible for your account credentials. Notify us
          immediately of any unauthorized use. We reserve the right to suspend
          or terminate your account if you violate these terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">4. License to Use</h2>
        <p>
          Uwise grants a limited, non-exclusive, non-transferable license to
          access the platform. You may not copy, share, or modify platform
          content or use automated tools like bots/scrapers.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">5. Payments and Refunds</h2>
        <p>
          All fees are payable upfront. Refunds are available within 7 days if
          less than 20% of a course is accessed. Requests should be sent to{" "}
          <a href="mailto:support@uwise.ng" className="text-blue-800 underline">
            support@uwise.ng
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
        <p>
          All content belongs to Uwise or its creators. You may not copy or
          redistribute materials without permission. Uwise trademarks may not be
          used without consent.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">7. User-Generated Content</h2>
        <p>
          You retain rights to your submissions but grant us a license to use
          them. Ensure your content doesn’t infringe on any third-party rights.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">8. Prohibited Conduct</h2>
        <ul className="list-disc list-inside">
          <li>No illegal, harmful, or fraudulent use.</li>
          <li>No harassment or abuse of others.</li>
          <li>No uploading viruses or harmful code.</li>
          <li>No plagiarism or academic dishonesty.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">9. Privacy</h2>
        <p>
          Your data is protected under our{" "}
          <a href="/privacy-policy" className="text-blue-800 underline">
            Privacy Policy
          </a>
          . We comply with NDPR and, where applicable, GDPR.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">10. Disclaimer of Warranties</h2>
        <p>
          The platform is provided “as is.” Uwise does not guarantee error-free
          service or complete accuracy of content.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">11. Limitation of Liability</h2>
        <p>
          Uwise is not liable for indirect or consequential damages. Total
          liability is limited to fees paid in the last 6 months.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">12. Indemnification</h2>
        <p>
          You agree to indemnify Uwise against claims or damages from your
          platform use or violation of these terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">13. Termination</h2>
        <p>
          We may terminate your account without notice for violations. All rights
          cease immediately upon termination.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">14. Force Majeure</h2>
        <p>
          Uwise is not responsible for delays caused by events outside our
          control (e.g., natural disasters, internet outages, etc.).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">15. Governing Law</h2>
        <p>
          These terms are governed by the laws of Nigeria. Disputes shall be
          resolved in Lagos courts.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">16. Changes to Terms</h2>
        <p>
          We may update these terms at any time. Continued use of our platform
          constitutes acceptance of the revised terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">17. Contact Information</h2>
        <p>
          For inquiries or support, contact us at:
          <br />
          <strong>Uwise Education</strong>
          <br />
          Email: <a href="mailto:support@uwise.ng" className="text-blue-800 underline">support@uwise.ng</a>
          <br />
          Phone: +234 [Insert Number]
          <br />
          Address: [Insert Office Address]
        </p>
      </section>
    </div>
  )
}
