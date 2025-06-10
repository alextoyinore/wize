'use client'

import Navbar from './Navbar';
import Footer from './Footer';
import { usePathname } from 'next/navigation'

export default function Layout({ children }) {

  const pathname = usePathname()

  const routes = ['login', 'register']

  return (
    <div className="min-h-screen relative scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
      {!routes.includes(pathname) && <Navbar />}
      <main className="max-w-[98%] lg:max-w-[78%] min-h-[35vh] mx-auto px-4 lg:py-8 md:px-6">
        {children}
      </main>
      {!pathname.includes('admin') && !pathname.includes('login') && !pathname.includes('register') && !pathname.includes('dashboard') && <Footer />}
    </div>
  );
}

