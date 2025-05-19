
export default function Home() {
  return (

    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Uwise
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your Ultimate Learning Platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Courses</h2>
              <p className="text-gray-600">
                Explore our wide range of courses on various subjects
              </p>
              <a
                href="/dashboard/courses"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Courses
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Roomium</h2>
              <p className="text-gray-600">
                Our advanced video conferencing solution for live classes
              </p>
              <a
                href="/dashboard/roomium"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Try Roomium
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Blog</h2>
              <p className="text-gray-600">
                Stay updated with our latest educational content
              </p>
              <a
                href="/dashboard/blog"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Read Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    </main> 
    
  );
}
