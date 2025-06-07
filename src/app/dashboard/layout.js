'use client'
import DashSidebar from '@/components/DashSidebar'

  
export default function DashboardLayout({ children }) {

  return (
    <div className="flex gap-8 h-screen">
      <DashSidebar className={'w-1/5'} />
      <main className="w-4/5 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

