export default function About() {
    return (
        <main className="min-h-[35vh]">
            {/* Hero Section */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-8">About Wize</h1>
                    <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
                        Empowering learners through innovative education technology
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 px-8 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                            <p className="text-gray-600 mb-4">
                                To provide accessible, high-quality education to learners worldwide through cutting-edge technology and innovative teaching methods.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Quality Education for All
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Continuous Innovation
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                            <p className="text-gray-600 mb-4">
                                To be the leading global platform for modern education, bridging the gap between traditional learning and digital transformation.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Global Impact
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Sustainable Growth
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Team member cards */}
                        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-lg transition-all hover:bg-blue-50">
                            <div className="flex gap-5 items-center">
                                <div className="w-16 h-16 mb-4 rounded-full flex-shrink-0 bg-blue-200"></div>
                                <div>
                                    <h3 className="text-xl font-semibold">John Doe</h3>
                                    <p className="text-gray-600">CEO & Founder</p>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-4">
                                John Doe is the CEO and Founder of Wize. With over 20 years of experience in the education technology industry, John has a proven track record of driving innovation and delivering exceptional results.
                            </p>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-lg transition-all hover:bg-blue-50">
                            <div className="flex gap-5 items-center">
                                <div className="w-16 h-16 mb-4 rounded-full flex-shrink-0 bg-blue-200"></div>
                                <div>
                                    <h3 className="text-xl font-semibold">Jane Smith</h3>
                                    <p className="text-gray-600">Chief Technology Officer</p>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-4">
                                Jane Smith is the Chief Technology Officer of Wize. With over 15 years of experience in software development, Jane has a proven track record of building scalable and innovative solutions.
                            </p>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-lg transition-all hover:bg-blue-50">
                            <div className="flex gap-5 items-center">
                                <div className="w-16 h-16 mb-4 rounded-full flex-shrink-0 bg-blue-200"></div>
                                <div>
                                    <h3 className="text-xl font-semibold">Mike Johnson</h3>
                                    <p className="text-gray-600">Head of Education</p>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-4">
                                Mike Johnson is the Head of Education at Wize. With over 25 years of experience in education, Mike has a proven track record of delivering high-quality education and innovative teaching methods.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

