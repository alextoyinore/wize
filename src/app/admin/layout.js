import Sidebar from "@/components/admin/Sidebar"

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex relative">
      <Sidebar className='sticky h-screen-[calc(100vh-64px)] top-25 left-0 lg:block' />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
