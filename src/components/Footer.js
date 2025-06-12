'use client'

import { useState } from 'react'
import Image from 'next/image'
import Logo from '@/assets/uwise.svg'
import Link from 'next/link'

export default function Footer() {
    const [email, setEmail] = useState('')
    const [subscriptionMessage, setSubscriptionMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to subscribe')
            }

            setSubscriptionMessage('Thank you for subscribing!')
            setEmail('')
        } catch (error) {
            setSubscriptionMessage(error.message)
        }
    }

    // useEffect(() => {
    //     const fetchSubscribers = async () => {
    //         try {
    //             const response = await fetch('/api/subscribers')
    //             const data = await response.json()
    //             setSubscribers(data)
    //         } catch (error) {
    //             console.error('Error fetching subscribers:', error)
    //         }
    //     }
    //     fetchSubscribers()
    // }, [])

    return (
        <footer className="text-gray-600 py-4 mt-12 text-sm w-full">
            <div className="mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-16 w-[90%] md:w-[75%] mx-auto">
                    <div className="">
                        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/courses" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Courses</Link></li>
                            <li><Link href="/pricing" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Pricing</Link></li>
                        </ul>
                    </div>
                    <div className="">
                        <h3 className="text-xl font-semibold mb-4">Pages</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">About Us</Link></li>
                            <li><Link href="/partnerships" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Partnerships</Link></li>
                            <li><Link href="/contact" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Contact</Link></li>
                            <li><Link href="/faqs" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">FAQs</Link></li>
                        </ul>
                    </div>
                    <div className="">
                        <h3 className="text-xl font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><Link href="/terms" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Privacy Policy</Link></li>
                            <li><Link href="/cookies" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    <div className="">
                        <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2">
                            <li><Link href="mailto:info@uwise.com" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">info@uwise.com</Link></li>
                            <li><Link href="tel:+2347079825808" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">+234 707 982 5808</Link></li>
                        </ul>
                    </div>
                    <div className="">
                        <Image 
                            src={Logo} 
                            alt="Uwise Logo" 
                            height={15} 
                            className="mb-5 mt-2 filter grayscale brightness-100 hover:grayscale-0 hover:brightness-100 transition-all duration-200 cursor-pointer"
                        />
                        <p className="text-gray-600">
                            Transform your learning journey with Uwise - the intelligent learning platform that adapts to your needs.
                        </p>
                    </div>

                    <div className="">
                            <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
                            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Subscribe
                                </button>
                            </form>
                            <p className="text-gray-600 mt-2">Subscribe to our newsletter for the latest updates and exclusive offers</p>

                            {subscriptionMessage && (
                                <p className={`mt-2 ${subscriptionMessage.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
                                    {subscriptionMessage}
                                </p>
                            )}

                        </div>
                </div>
                <div className="mt-8 mb-4 pt-8 border-t border-gray-200 text-center">
                    <p className="text-gray-600">
                        &copy; {new Date().getFullYear()} Uwise. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

