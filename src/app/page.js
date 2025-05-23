'use client'

import { useEffect, useState } from "react"

export default function Home() {
  const [courses, setCourses] = useState([])
  
  const fetchCourses = async () => {
    const res = await fetch('/api/courses?limit=6')
    const data = await res.json()
    setCourses(data.courses || []) // Ensure we always have an array
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <main className="min-h-screen px-4">
      {/* Hero Section */}
      <section className="relative w-full py-20 px-5">
        {/* Background Gradient */}
        <div className="absolute w-full inset-0 bg-gradient-to-r rounded-2xl from-indigo-50 to-green-50 opacity-50"></div>
        
        {/* Hero Content */}
        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-10">
                Learn Skills. Build Your Future.
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto md:mx-0">
                Practical online and offline courses in tech, business, design, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                >
                  Get Started
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 hover:border-green-600 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-green-400 hover:text-white transition-all duration-200"
                >
                  Learn More
                </a>
              </div>
            </div>
            
            {/* Right Content - Illustration */}
            <div className="flex-1 text-center md:text-right">
              <img
                src="/images/hero-illustration.svg"
                alt="African professionals learning and working"
                className="w-full max-w-lg mx-auto"
              />
            </div>
          </div>

          {/* Trust Badges and Stats */}
          <div className="mt-10">
            <div className="flex flex-col md:flex-row md:justify-start gap-8 max-w-4xl">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>100% Nigerian Curriculum</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>95% Student Satisfaction</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                <span>1000+ Students Served</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Uwise Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Uwise?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover why thousands of Nigerian learners trust Uwise for their skill development journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="group relative bg-white p-6 rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute -top-4 -right-4 bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Learn In-Demand Skills
              </h3>
              <p className="text-gray-600">
                Practical courses aligned with Nigerian job market needs
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-white p-6 rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute -top-4 -right-4 bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Online & Offline Access
              </h3>
              <p className="text-gray-600">
                Flexible learning options to fit your schedule and needs
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-white p-6 rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute -top-4 -right-4 bg-purple-100 rounded-full p-3">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Career Support
              </h3>
              <p className="text-gray-600">
                Get guidance from industry experts and access to job opportunities
              </p>
            </div>

            {/* Card 4 */}
            <div className="group relative bg-white p-6 rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute -top-4 -right-4 bg-indigo-100 rounded-full p-3">
                <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 7h-2v5H7v2h4v5h2v-5h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Nigerian Curriculum
              </h3>
              <p className="text-gray-600">
                Courses designed specifically for the Nigerian market
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Showcase Section */}
      <section className="py-16 relative bg-gradient-to-r from-indigo-50 to-green-50 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular courses designed by industry experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={course._id} className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative h-48 mb-6">
                  <img 
                    src={course.image || '/images/course-default.jpg'} 
                    alt={course.title} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${
                    index === 0 ? 'bg-blue-100 text-blue-600' :
                    index === 1 ? 'bg-green-100 text-green-600' :
                    index === 2 ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {course.isNew ? 'New' : course.isPopular ? 'Popular' : course.isFeatured ? 'Featured' : ''}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {course.description.slice(0, 100)}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{course.duration} weeks</span>
                  <span>{course.level}</span>
                </div>
                <a
                  href={`/courses/${course.slug || course._id}`}
                  className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-all duration-200 ${
                    index === 0 ? 'text-blue-600 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500' :
                    index === 1 ? 'text-green-600 bg-green-100 hover:bg-green-200 focus:ring-green-500' :
                    index === 2 ? 'text-purple-600 bg-purple-100 hover:bg-purple-200 focus:ring-purple-500' :
                    'text-gray-600 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500'
                  }`}>
                  {course.isNew ? 'Enroll Now' : 'Learn More'}
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/explore"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              View All Courses
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Success stories from our students who've transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">John Adeyemi</h3>
                  <p className="text-gray-600">Web Development Essentials</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic">
                "Uwise gave me the skills and confidence to land my first job as a junior developer. The practical projects were invaluable."
              </blockquote>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Aisha Yusuf</h3>
                  <p className="text-gray-600">Data Science Fundamentals</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic">
                "The data science course was exactly what I needed to pivot my career into tech. The instructors were amazing!"
              </blockquote>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Tunde Akindele</h3>
                  <p className="text-gray-600">Digital Marketing Masterclass</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic">
                "The digital marketing course helped me grow my business by 300% in just 3 months. Highly recommended!"
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* How Uwise Works Section */}
      <section className="py-16 bg-gradient-to-r rounded-2xl from-indigo-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Uwise Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to start learning and growing your skills
            </p>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-sm">
            {/* Step 1 */}
            <div className="flex items-center mb-12">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900">Browse Courses</h3>
                <p className="mt-2 text-gray-600">Explore our wide range of courses across different categories</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center mb-12">
              <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900">Enroll & Start Learning</h3>
                <p className="mt-2 text-gray-600">Sign up and begin your learning journey with our structured curriculum</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center mb-12">
              <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-purple-600">3</span>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900">Learn & Practice</h3>
                <p className="mt-2 text-gray-600">Engage with interactive lessons and hands-on projects</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-indigo-600">4</span>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900">Get Certified</h3>
                <p className="mt-2 text-gray-600">Earn industry-recognized certificates to showcase your skills</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white text-gray-900 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Wize</h3>
              <p className="text-gray-600">
                Transform your learning journey with Wize - the intelligent learning platform that adapts to your needs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">About Us</a></li>
                <li><a href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Courses</a></li>
                <li><a href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Pricing</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Terms & Conditions</a></li>
                <li><a href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="/cookies" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="my-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} Wize. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main> 
  );
}
