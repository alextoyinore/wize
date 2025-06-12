'use client'

import Link from 'next/link'

export default function Privacy() {
  return (
    <main className="min-h-[35vh]">
      {/* Hero Section */}
      <section className="my-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold lg:text-center mb-4 lg:mb-8">Privacy Policy</h1>
          <div className="text-lg text-gray-800 lg:text-center max-w-2xl mx-auto">
            <p><strong>Effective Date:</strong> May 17, 2025</p>
            <p><strong>Last Updated:</strong> May 17, 2025</p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-8">
        <div className="container mx-auto">
          <div className="lg:bg-blue-50/50 lg:border lg:border-blue-100 lg:rounded-2xl lg:p-16">
            <article className="lg:grid md:grid-cols-3 gap-8">
              <h2 className="text-2xl font-bold my-4 lg:mb-6">1. Introduction</h2>
              <div className="space-y-6 col-span-2">
                <p className="text-gray-800 leading-6">
                  Uwise ("we", "our", or "us") values your privacy and is committed to
                  protecting your personal data. This Privacy Policy outlines how we
                  collect, use, disclose, and safeguard your information when you visit
                  or use our Learning Management System, website, and services.
                </p>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">2. Information We Collect</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <ul className="list-disc list-inside text-gray-800 leading-6">
                    <li><strong>Personal Data:</strong> Name, email, phone number, gender, date of birth, address, etc.</li>
                    <li><strong>Account Data:</strong> Login credentials, course enrollments, progress history.</li>
                    <li><strong>Payment Information:</strong> Billing details, transaction IDs (processed via third-party providers).</li>
                    <li><strong>Usage Data:</strong> IP address, browser type, pages visited, session duration.</li>
                    <li><strong>Device Information:</strong> Device type, OS, and unique device identifiers.</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">3. How We Use Your Information</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <p className="text-gray-800 leading-6">We use your data for the following purposes:</p>
                  <ul className="list-disc list-inside text-gray-800 leading-6">
                    <li>To create and manage user accounts</li>
                    <li>To provide course access and track your learning progress</li>
                    <li>To process payments securely</li>
                    <li>To send important communications (updates, receipts, support)</li>
                    <li>To improve platform functionality and user experience</li>
                    <li>For marketing (only with your consent)</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">4. Legal Basis for Processing</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <p className="text-gray-800 leading-6">We process your data based on:</p>
                  <ul className="list-disc list-inside text-gray-800 leading-6">
                    <li>Consent (where required)</li>
                    <li>Contractual necessity</li>
                    <li>Legitimate interests (e.g., to improve services)</li>
                    <li>Legal obligations</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">5. How We Share Your Information</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <p className="text-gray-800 leading-6">
                    We do not sell your personal data. However, we may share your data with:
                  </p>
                  <ul className="list-disc list-inside text-gray-800 leading-6">
                    <li>Third-party service providers (e.g., payment processors, hosting providers)</li>
                    <li>Instructors or trainers (to manage course-related communications)</li>
                    <li>Law enforcement, if required by law</li>
                    <li>Business partners, only with your consent</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">6. Data Security</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <p className="text-gray-800 leading-6">
                    We use encryption, firewalls, and secure access controls to protect your
                    data. However, no system is 100% secure, and we cannot guarantee
                    absolute security.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">7. Data Retention</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <p className="text-gray-800 leading-6">
                    We retain personal data only for as long as necessary to fulfill the
                    purposes outlined in this policy or as required by law. You may request
                    deletion of your account at any time.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">8. Your Rights</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <p className="text-gray-800 leading-6">You have the right to:</p>
                  <ul className="list-disc list-inside text-gray-800 leading-6">
                    <li>Access and update your personal data</li>
                    <li>Request deletion of your data</li>
                    <li>Withdraw consent at any time</li>
                    <li>Object to data processing</li>
                    <li>Complain to a regulatory authority (e.g., NITDA under NDPR)</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">9. Cookies and Tracking Technologies</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <p className="text-gray-800 leading-6">
                    We use cookies to enhance your experience. You can control cookie
                    preferences through your browser settings. Disabling cookies may affect
                    platform functionality.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">10. Third-Party Links</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <p className="text-gray-800 leading-6">
                    Our website may contain links to third-party websites. We are not responsible
                    for the privacy practices or content of these sites. Please review their privacy
                    policies before sharing any personal information.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">11. Changes to This Policy</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <p className="text-gray-800 leading-6">
                    We may update this Privacy Policy from time to time. Any changes will be
                    posted on this page with an updated effective date. We encourage you to
                    review this policy periodically.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">12. Contact Us</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <p className="text-gray-800 leading-6">
                    If you have any questions about this Privacy Policy, please contact us at:
                    <br />
                    Email: <Link href="mailto:support@uwise.ng" className="text-blue-800 underline">support@uwise.ng</Link>
                    <br />
                    Phone: +234 [Insert Number]
                    <br />
                    Address: [Insert Office Address]
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">13. Children's Privacy</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <p className="text-gray-800 leading-6">
                    Our services are not directed to children under 16 without parental
                    consent. If we become aware of unauthorized data collection from a
                    child, we will delete the information promptly.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold my-4 lg:mb-6">14. International Users</h2>
              <div className="space-y-6 col-span-2">
                <div>
                  <p className="text-gray-800 leading-6">
                    If you are accessing our platform from outside Nigeria, be aware that
                    your data may be transferred to and stored in Nigeria. By using our
                    services, you consent to this transfer.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

