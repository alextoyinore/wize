'use client'

import Sidebar from "@/components/admin/Sidebar"
import { usePathname } from "next/navigation"

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen flex relative">
      {pathname !== '/admin/login' && (
        <Sidebar className='sticky h-screen-[calc(100vh-64px)] top-25 left-0 lg:block' />
      )}
      <main className="flex-1 pl-6">
        {children}
      </main>
    </div>
  )
}

