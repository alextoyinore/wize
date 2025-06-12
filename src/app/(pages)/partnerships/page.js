'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Partnerships() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    partnershipType: 'business',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData)
    alert('Thank you for your interest! We will contact you soon.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      organization: '',
      partnershipType: 'business',
      message: ''
    })
    // router.push('/success')
  }

  return (
    <main className="min-h-[35vh]">
      {/* Hero Section */}
      <section className="my-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold lg:text-center mb-4 lg:mb-8">Partnerships</h1>
          <div className="text-lg text-gray-800 lg:text-center max-w-2xl mx-auto">
            <p><strong>Effective Date:</strong> June 12, 2025</p>
          </div>
        </div>
      </section>

      {/* Partnerships Content */}
      <section className="py-8">
        <div className="container mx-auto">
          <div className="lg:bg-blue-50/50 lg:border lg:border-blue-100 lg:rounded-2xl lg:px-8 lg:py-8">
            <article className="lg:grid md:grid-cols-3 gap-8">
                <h2 className="text-2xl font-bold my-4 lg:mb-6">1. Partnership Opportunities</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Business Partnerships</h3>
                    <p className="text-gray-800 leading-6">
                      We welcome opportunities to collaborate with businesses that share our vision of quality education.
                      Whether you're interested in content creation, technology integration, or marketing partnerships,
                      we're eager to explore how we can work together to achieve mutual success.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">School Partnerships</h3>
                    <p className="text-gray-800 leading-6">
                      We partner with educational institutions to enhance their curriculum and provide students
                      with access to high-quality online learning resources. Our partnership programs include
                      course integration, faculty development, and student engagement initiatives.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Government Partnerships</h3>
                    <p className="text-gray-800 leading-6">
                      We work with government agencies to support educational initiatives and policy development.
                      Our partnerships focus on improving access to quality education, developing educational
                      standards, and implementing innovative learning solutions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Other Partnerships</h3>
                    <p className="text-gray-800 leading-6">
                      We're open to exploring unique partnership opportunities that align with our mission.
                      Whether you represent a non-profit organization, research institution, or have another
                      innovative idea, we'd love to hear from you.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">2. Contact Us</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                          Organization Name
                        </label>
                        <input
                          type="text"
                          id="organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type of Partnership
                        </label>
                        <select
                          id="partnershipType"
                          name="partnershipType"
                          value={formData.partnershipType}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="business">Business</option>
                          <option value="school">School</option>
                          <option value="government">Government</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Tell us about your partnership interest..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Submit Inquiry
                      </button>
                    </form>
                  </div>
                </div>

                <h2 className="text-2xl font-bold my-4 lg:mb-6">3. Contact Information</h2>
                <div className="space-y-6 col-span-2">
                  <div>
                    <p className="text-gray-800 leading-6">
                      For immediate assistance, please contact our partnerships team at:
                      <br />
                      <strong>Uwise Education</strong>
                      <br />
                      Email: <Link href="mailto:partnerships@uwise.ng" className="text-blue-800 underline">partnerships@uwise.ng</Link>
                      <br />
                      Phone: +234 707 982 5808
                      <br />
                      Address: 1, Tunji Idowu, Abule Egba, Lagos, Nigeria
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

