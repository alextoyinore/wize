'use client'

export default function Footer() {
    return (
        <footer className="bg-white text-gray-900 py-12 mt-12 text-sm w-[80%] mx-auto">
            <div className="mx-auto">
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
                <div className="mt-8 mb-4 pt-8 border-t border-gray-200 text-center">
                    <p className="text-gray-600">
                        &copy; {new Date().getFullYear()} Wize. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}   