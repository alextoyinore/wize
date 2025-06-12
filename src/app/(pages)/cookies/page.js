export default function CookiePolicy() {
    return (
        <main className="min-h-[35vh]">
            {/* Hero Section */}
            <section className="my-4 lg:my-8">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-bold lg:text-center mb-4 lg:mb-8">Cookie Policy</h1>
                    <p className="text-lg text-gray-600 lg:text-center max-w-2xl mx-auto">
                        Learn about our use of cookies and how to manage your preferences
                    </p>
                </div>
            </section>

            {/* Cookie Policy Content */}
            <section className="py-8 ">
                <div className="container mx-auto">
                    <div className="lg:bg-blue-50/50 lg:border lg:border-blue-100 lg:rounded-2xl lg:px-8 lg:py-16">
                        <article className="lg:grid md:grid-cols-3 gap-8">
                            <h2 className="text-2xl font-bold mb-6">What are Cookies?</h2>
                            <p className="mb-6 col-span-2">
                                Cookies are small text files that are stored on your device when you visit websites. They help us provide you with a better experience by remembering your preferences and improving our website's functionality.
                            </p>

                            <h2 className="text-2xl font-bold mb-6">Types of Cookies We Use</h2>
                            <div className="space-y-6 col-span-2">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
                                    <p className="text-gray-600">
                                        These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Performance Cookies</h3>
                                    <p className="text-gray-600">
                                        These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Functional Cookies</h3>
                                    <p className="text-gray-600">
                                        These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                                    </p>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold my-4 lg:mb-6">Managing Your Cookie Preferences</h2>
                            <div className="space-y-6 col-span-2">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Browser Settings</h3>
                                    <p className="text-gray-600">
                                        Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Cookie Consent Manager</h3>
                                    <p className="text-gray-600">
                                        We provide a cookie consent manager that allows you to control which types of cookies you accept on our website. You can access this manager at any time.
                                    </p>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold my-4 lg:mb-6">Third Party Cookies</h2>
                            <p className="mb-6 col-span-2">
                                We use third-party services that may also set cookies on your device. These include analytics providers and social media platforms. We do not control these cookies and you should check the relevant third party's website for more information about their cookies.
                            </p>

                            <h2 className="text-2xl font-bold my-4 lg:mb-6">Updates to Our Cookie Policy</h2>
                            <p className="col-span-2">
                                We may update our Cookie Policy from time to time in response to changing legal, regulatory, and business requirements. When we update our Cookie Policy, we will take appropriate measures to inform you, consistent with the significance of the changes we make.
                            </p>
                        </article>
                    </div>
                </div>
            </section>
        </main>
    )
}