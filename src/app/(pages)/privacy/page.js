'use client'

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto min-h-[35vh] dark:text-white text-black space-y-6">
      <h1 className="text-3xl font-bold text-blue-800">Privacy Policy</h1>
      <p><strong>Effective Date:</strong> May 17, 2025</p>
      <p><strong>Last Updated:</strong> May 17, 2025</p>

      <section>
        <h2 className="text-lg font-semibold">1. Introduction</h2>
        <p className="text-gray-600 leading-6 text-sm">
          Uwise ("we", "our", or "us") values your privacy and is committed to
          protecting your personal data. This Privacy Policy outlines how we
          collect, use, disclose, and safeguard your information when you visit
          or use our Learning Management System, website, and services.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">2. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-600 leading-6 text-sm">
          <li><strong>Personal Data:</strong> Name, email, phone number, gender, date of birth, address, etc.</li>
          <li><strong>Account Data:</strong> Login credentials, course enrollments, progress history.</li>
          <li><strong>Payment Information:</strong> Billing details, transaction IDs (processed via third-party providers).</li>
          <li><strong>Usage Data:</strong> IP address, browser type, pages visited, session duration.</li>
          <li><strong>Device Information:</strong> Device type, OS, and unique device identifiers.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">3. How We Use Your Information</h2>
        <p className="text-gray-600 leading-6 text-sm">We may use your data for the following purposes:</p>
        <ul className="list-disc list-inside text-gray-600 leading-6 text-sm">
          <li>To create and manage user accounts</li>
          <li>To provide course access and track your learning progress</li>
          <li>To process payments securely</li>
          <li>To send important communications (updates, receipts, support)</li>
          <li>To improve platform functionality and user experience</li>
          <li>For marketing (only with your consent)</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">4. Legal Basis for Processing</h2>
        <p className="text-gray-600 leading-6 text-sm">We process your data based on:</p>
        <ul className="list-disc list-inside text-gray-600 leading-6 text-sm">
          <li>Consent (where required)</li>
          <li>Contractual necessity</li>
          <li>Legitimate interests (e.g., to improve services)</li>
          <li>Legal obligations</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">5. How We Share Your Information</h2>
        <p className="text-gray-600 leading-6 text-sm">
          We do not sell your personal data. However, we may share your data with:
        </p>
        <ul className="list-disc list-inside text-gray-600 leading-6 text-sm">
          <li>Third-party service providers (e.g., payment processors, hosting providers)</li>
          <li>Instructors or trainers (to manage course-related communications)</li>
          <li>Law enforcement, if required by law</li>
          <li>Business partners, only with your consent</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">6. Data Security</h2>
        <p className="text-gray-600 leading-6 text-sm">
          We use encryption, firewalls, and secure access controls to protect your
          data. However, no system is 100% secure, and we cannot guarantee
          absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">7. Data Retention</h2>
        <p className="text-gray-600 leading-6 text-sm">
          We retain personal data only for as long as necessary to fulfill the
          purposes outlined in this policy or as required by law. You may request
          deletion of your account at any time.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">8. Your Rights</h2>
        <p className="text-gray-600 leading-6 text-sm">You have the right to:</p>
        <ul className="list-disc list-inside text-gray-600 leading-6 text-sm">
          <li>Access and update your personal data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent at any time</li>
          <li>Object to data processing</li>
          <li>Complain to a regulatory authority (e.g., NITDA under NDPR)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">9. Cookies and Tracking Technologies</h2>
        <p className="text-gray-600 leading-6 text-sm">
          We use cookies to enhance your experience. You can control cookie
          preferences through your browser settings. Disabling cookies may affect
          platform functionality.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">10. Third-Party Links</h2>
        <p className="text-gray-600 leading-6 text-sm">
          Our platform may link to third-party websites. We are not responsible
          for their content or privacy practices. We encourage you to review
          their privacy policies before sharing data.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">11. Children's Privacy</h2>
        <p className="text-gray-600 leading-6 text-sm">
          Our services are not directed to children under 16 without parental
          consent. If we become aware of unauthorized data collection from a
          child, we will delete the information promptly.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">12. International Users</h2>
        <p>
          If you are accessing our platform from outside Nigeria, be aware that
          your data may be transferred to and stored in Nigeria. By using our
          services, you consent to this transfer.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">13. Changes to This Policy</h2>
        <p className="text-gray-600 leading-6 text-sm">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with the updated effective date. Continued use
          of the platform indicates acceptance of the revised policy.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">14. Contact Us</h2>
        <p className="text-gray-600 leading-6 text-sm">
          If you have questions or concerns about this Privacy Policy, please
          contact us:
        </p>
        <p className="text-gray-600 leading-6 text-sm">
          <strong>Uwise Education</strong><br />
          Email: <a href="mailto:support@uwise.ng" className="text-blue-800 underline">support@uwise.ng</a><br />
          Phone: +234 [Insert Number]<br />
          Address: [Insert Office Address]
        </p>
      </section>
    </div>
  )
}

