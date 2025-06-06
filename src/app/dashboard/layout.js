'use client'

  
export default function DashboardLayout({ children }) {

  return (
    <div className="flex gap-8 h-screen">
      <main className="flex-1 w-3/4 overflow-y-auto">
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
