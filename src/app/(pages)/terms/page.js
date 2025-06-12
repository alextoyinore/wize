'use client'

import Link from 'next/link'

export default function Terms() {
  return (
    <main className="min-h-[35vh]">
      {/* Hero Section */}
      <section className="my-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold lg:text-center mb-4 lg:mb-8">Terms and Conditions</h1>
          <div className="text-lg text-gray-800 lg:text-center max-w-2xl mx-auto">
            <p><strong>Effective Date:</strong> May 17, 2025</p>
            <p><strong>Last Updated:</strong> May 17, 2025</p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-8">
        <div className="container mx-auto">
          <div className="lg:bg-blue-50/50 lg:border lg:border-blue-100 lg:rounded-2xl lg:p-16">
            <article className="lg:grid md:grid-cols-3 gap-8">
                <h2 className="text-2xl font-bold my-4 lg:mb-6">1. Definitions</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      <strong>"Uwise"</strong> refers to Uwise Education, its agents,
                      employees, and affiliates.
                      <br />
                      <strong>"Platform"</strong> means our LMS, website, and services.
                      <br />
                      <strong>"User"</strong> means anyone using our platform.
                      <br />
                      <strong>"Content"</strong> refers to course materials, videos, documents, etc.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">2. Eligibility</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <ul className="list-disc list-inside text-gray-800 leading-6">
                      <li>You must be at least 16 years old.</li>
                      <li>If under 18, parental/guardian consent is required.</li>
                      <li>You must provide accurate registration details.</li>
                      <li>You agree to comply with NDPR and all applicable laws.</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">3. User Account</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      You are responsible for your account credentials. Notify us
                      immediately of any unauthorized use. We reserve the right to suspend
                      or terminate your account if you violate these terms.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">4. License to Use</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      Uwise grants a limited, non-exclusive, non-transferable license to
                      access the platform. You may not copy, share, or modify platform
                      content or use automated tools like bots/scrapers.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">5. Payments and Refunds</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      All fees are payable upfront. Refunds are available within 7 days if
                      less than 20% of a course is accessed. Requests should be sent to <Link href="mailto:support@uwise.ng" className="text-blue-800 underline">
                        support@uwise.ng
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">6. Intellectual Property</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      All content belongs to Uwise or its creators. You may not copy or
                      redistribute materials without permission. Uwise trademarks may not be
                      used without consent.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">7. User-Generated Content</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      You retain rights to your submissions but grant us a license to use
                      them. Ensure your content doesn't infringe on any third-party rights.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">8. Prohibited Conduct</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <ul className="list-disc list-inside text-gray-800 leading-6">
                      <li>No illegal, harmful, or fraudulent use.</li>
                      <li>No harassment or abuse of others.</li>
                      <li>No uploading viruses or harmful code.</li>
                      <li>No plagiarism or academic dishonesty.</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">9. Privacy</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      Your data is protected under our <Link href="privacy" className="text-blue-800 underline">
                        Privacy Policy
                      </Link>
                      . We comply with NDPR and, where applicable, GDPR.
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold">10. Disclaimer of Warranties</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      The platform is provided “as is.” Uwise does not guarantee error-free
                      service or complete accuracy of content.
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold">11. Limitation of Liability</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      Uwise is not liable for indirect or consequential damages. Total
                      liability is limited to fees paid in the last 6 months.
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold">12. Indemnification</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      You agree to indemnify Uwise against claims or damages from your
                      platform use or violation of these terms.
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold">13. Termination</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      We may terminate your account without notice for violations. All rights
                      cease immediately upon termination.
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold">14. Force Majeure</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      Uwise is not responsible for delays caused by events outside our
                      control (e.g., natural disasters, internet outages, etc.).
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold">15. Governing Law</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      These terms are governed by the laws of Nigeria. Disputes shall be
                      resolved in Lagos courts.
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold">16. Changes to Terms</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      We may update these terms at any time. Continued use of our platform
                      constitutes acceptance of the revised terms.
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold">17. Contact Information</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      For inquiries or support, contact us at:
                      <br />
                      <strong>Uwise Education</strong>
                      <br />
                      Email: <Link href="mailto:support@uwise.ng" className="text-blue-800 underline">support@uwise.ng</Link>
                      <br />
                      Phone: +234 7079825808
                      <br />
                      Address: 1, Tunji Idowu Abule-Egba
                      <br />
                      Lagos, Nigeria
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

