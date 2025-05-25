'use client'

import Navbar from './Navbar';
import Footer from './Footer';
import { usePathname } from 'next/navigation'

export default function Layout({ children }) {

  const pathname = usePathname()

  const routes = ['login', 'register']

  return (
    <div className="min-h-screen">
      {!routes.includes(pathname) && <Navbar />}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      {!pathname.includes('admin') || !pathname.includes('login') || !pathname.includes('register') || !pathname.includes('dashboard') && <Footer />}
    </div>
  );
}

