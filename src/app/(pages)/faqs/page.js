'use client'

import Link from 'next/link'

export default function Faqs() {
  return (
    <main className="min-h-[35vh]">
      {/* Hero Section */}
      <section className="my-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold lg:text-center mb-4 lg:mb-8">Frequently Asked Questions</h1>
          <div className="text-lg text-gray-800 lg:text-center max-w-2xl mx-auto">
            <p><strong>Last Updated:</strong> June 12, 2025</p>
          </div>
        </div>
      </section>

      {/* FAQs Content */}
      <section className="py-8">
        <div className="container mx-auto">
          <div className="lg:bg-blue-50/50 lg:border lg:border-blue-100 lg:rounded-2xl lg:px-8 lg:py-16">
            <article className="lg:grid md:grid-cols-3 gap-8">
                <h2 className="text-2xl font-bold my-4 lg:mb-6">1. General Questions</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <details className="space-y-4">
                      <summary className="text-lg font-semibold text-gray-800 cursor-pointer">What is Uwise?</summary>
                      <p className="text-gray-800 leading-6">
                        Uwise is an online learning platform dedicated to providing high-quality educational resources and courses.
                      </p>
                    </details>

                    <details className="space-y-4">
                      <summary className="text-lg font-semibold text-gray-800 cursor-pointer">Who can use Uwise?</summary>
                      <p className="text-gray-800 leading-6">
                        Our platform is open to anyone aged 16 and above. Users under 18 require parental consent.
                      </p>
                    </details>

                    <details className="space-y-4">
                      <summary className="text-lg font-semibold text-gray-800 cursor-pointer">Is Uwise free?</summary>
                      <p className="text-gray-800 leading-6">
                        We offer both free and premium courses. Premium courses require payment.
                      </p>
                    </details>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">2. Course Access</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <details className="space-y-4">
                      <summary className="text-lg font-semibold text-gray-800 cursor-pointer">How do I access courses?</summary>
                      <p className="text-gray-800 leading-6">
                        After enrolling, courses are available in your dashboard. You can access them anytime.
                      </p>
                    </details>

                    <details className="space-y-4">
                      <summary className="text-lg font-semibold text-gray-800 cursor-pointer">Can I access courses offline?</summary>
                      <p className="text-gray-800 leading-6">
                        Some courses offer downloadable materials. However, most content requires internet access.
                      </p>
                    </details>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">3. Payments</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <details className="space-y-4">
                      <summary className="text-lg font-semibold text-gray-800 cursor-pointer">What payment methods are accepted?</summary>
                      <p className="text-gray-800 leading-6">
                        We accept major credit cards, debit cards, and popular digital wallets.
                      </p>
                    </details>

                    <details className="space-y-4">
                      <summary className="text-lg font-semibold text-gray-800 cursor-pointer">Is my payment secure?</summary>
                      <p className="text-gray-800 leading-6">
                        Yes, we use industry-standard encryption to protect your payment information.
                      </p>
                    </details>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">4. Technical Support</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <details className="space-y-4">
                      <summary className="text-lg font-semibold text-gray-800 cursor-pointer">What if I need help?</summary>
                      <p className="text-gray-800 leading-6">
                        Contact our support team at <Link href="mailto:support@uwise.ng" className="text-blue-800 underline">support@uwise.ng</Link> or visit our <Link href="/contact" className="text-blue-800 underline">Contact page</Link>.
                      </p>
                    </details>

                    <details className="space-y-4">
                      <summary className="text-lg font-semibold text-gray-800 cursor-pointer">What are your system requirements?</summary>
                      <p className="text-gray-800 leading-6">
                        A modern web browser and stable internet connection are required. Recommended minimum screen resolution: 1366x768.
                      </p>
                    </details>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">5. More Questions?</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      If you have more questions, please contact us at:
                      <br />
                      <strong>Uwise Education</strong>
                      <br />
                      Email: <Link href="mailto:support@uwise.ng" className="text-blue-800 underline">support@uwise.ng</Link>
                      <br />
                      Phone: +234 [Insert Number]
                      <br />
                      Address: [Insert Office Address]
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