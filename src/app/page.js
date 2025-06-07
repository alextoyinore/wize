'use client'

import Footer from "@/components/Footer"
import HomeHero from "@/components/HomeHero"
import Partners from "@/components/Partners"
import { useEffect, useState } from "react"

export default function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const fetchCourses = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/courses?limit=6')
      const data = await res.json()
      setCourses(data.courses || []) 
    } catch (error) {
      setError('Failed to fetch courses')
      // console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  
  return (
    <main className="min-h-screen">

      {/* Background Gradient */}
      <div className="absolute w-full inset-0 bg-gradient-to-r md:rounded-2xl from-blue-100 to-green-100 opacity-10 -z-50"></div>
      
      <HomeHero className="mt-16" />

      {/* <Partners className="" /> */}

      {/* Course Showcase Section */}
      <section className="my-16 lg:mt-32 flex flex-col justify-center">
        <div className="max-w-6xl mx-auto px-4 lg:p-0">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-800 mb-4">
              Explore Our Courses
            </h2>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
              Discover our most popular courses designed by industry experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="flex lg:col-span-3 items-center justify-center h-48 w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
               courses.map((course, index) => (
              <div key={course._id} className="group bg-white/50 p-6 rounded-lg transition-all duration-300 cursor-pointer hover:border-blue-800/10 hover:border-2 hover:-translate-y-1">
                <div className="relative h-48 mb-6">
                  <img 
                    src={course.image || '/images/course-default.jpg'} 
                    alt={course.title} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${
                    index === 0 ? 'bg-blue-100 text-blue-800' :
                    index === 1 ? 'bg-green-100 text-green-600' :
                    index === 2 ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {course.isNew ? 'New' : course.isPopular ? 'Popular' : course.isFeatured ? 'Featured' : ''}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
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
                    index === 0 ? 'text-blue-800 bg-blue-100 hover:bg-blue-200 focus:ring-blue-800' :
                    index === 1 ? 'text-green-600 bg-green-100 hover:bg-green-200 focus:ring-green-500' :
                    index === 2 ? 'text-purple-600 bg-purple-100 hover:bg-purple-200 focus:ring-purple-500' :
                    'text-gray-600 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500'
                  }`}>
                  {course.isNew ? 'Enroll Now' : 'Learn More'}
                </a>
              </div>
            )))}
          </div>

          <div className="text-center mt-6">
            <a
              href="/explore"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 transition-all duration-200"
            >
              Browse All Courses
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Uwise Section */}
      <section id="features" className="mt-16 lg:mt-32 md:mt-36 flex flex-col justify-center">
        <div className="pr-4 lg:px-0">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-800 mb-4">
              Why Choose Uwise?
            </h2>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
              Discover why thousands of Nigerian learners trust Uwise for their skill development journey
            </p>
          </div>

          <div className="pr-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="group relative bg-white/50 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute -top-4 -right-4 bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
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
            <div className="group relative bg-white/50 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
            <div className="group relative bg-white/50 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
            <div className="group relative bg-white/50 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute -top-4 -right-4 bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 7h-2v5H7v2h4v5h2v-5h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Industry Expert Courses
              </h3>
              <p className="text-gray-600">
                Courses designed by industry experts to meet the needs of the African market
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="my-16 lg:mt-32 flex flex-col justify-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-800 mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Success stories from our students who've transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-50">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">John Adeyemi</h3>
                  <p className="text-gray-600">Web Development Essentials</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic">
                "Uwise gave me the skills and confidence to land my first job as a junior developer. The practical projects were invaluable."
              </blockquote>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-50">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Aisha Yusuf</h3>
                  <p className="text-gray-600">Data Science Fundamentals</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic">
                "The data science course was exactly what I needed to pivot my career into tech. The instructors were amazing!"
              </blockquote>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-50">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Tunde Akindele</h3>
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
      <section className="my-16 flex flex-col justify-center min-h-[70vh]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-800">
              How Uwise Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto my-3">
              Simple steps to start learning and growing your skills
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex items-start mb-12">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-800">1</span>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-semibold text-blue-800">Browse Courses</h3>
                <p className="mt-2 text-gray-600">Explore our wide range of courses across different categories</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start mb-12">
              <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-blue-800">Enroll & Start Learning</h3>
                <p className="mt-2 text-gray-600">Sign up and begin your learning journey with our structured curriculum</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start mb-12">
              <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-purple-600">3</span>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-blue-800">Learn & Practice</h3>
                <p className="mt-2 text-gray-600">Engage with interactive lessons and hands-on projects</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-800">4</span>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-blue-800">Get Certified</h3>
                <p className="mt-2 text-gray-600">Earn industry-recognized certificates to showcase your skills</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main> 
  );
}

