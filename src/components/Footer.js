'use client'

import Image from 'next/image'
import Logo from '@/assets/uwise.svg'

export default function Footer() {
    return (
        <footer className="text-gray-600 py-12 mt-12 text-sm w-full">
            <div className="mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-[90%] md:w-[75%] mx-auto">
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
                        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/about" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">About Us</a></li>
                            <li><a href="/courses" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Courses</a></li>
                            <li><a href="/pricing" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Pricing</a></li>
                            <li><a href="/contact" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Contact</a></li>
                        </ul>
                    </div>
                    <div className="">
                        <h3 className="text-xl font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="/terms" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Terms & Conditions</a></li>
                            <li><a href="/privacy" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Privacy Policy</a></li>
                            <li><a href="/cookies" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">Cookie Policy</a></li>
                        </ul>
                    </div>

                    <div className="">
                        <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2">
                            <li><a href="mailto:info@uwise.com" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">info@uwise.com</a></li>
                            <li><a href="tel:+2348123456789" className="text-gray-600 hover:text-blue-800 transition-colors duration-200">+234 812 345 6789</a></li>
                        </ul>
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