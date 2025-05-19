import Sidebar from "@/components/admin/Sidebar"

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex relative">
      <Sidebar className='lg:sticky h-screen-[calc(100vh-64px)] lg:top-25 lg:left-0' />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
