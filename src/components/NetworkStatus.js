import { useState, useEffect } from 'react'

export default function NetworkStatus({ loading, error, children }) {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="text-2xl">🌐</div>
        <h2 className="text-xl font-semibold">No Internet Connection</h2>
        <p className="text-gray-600">Please check your internet connection and try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="text-2xl">⚠️</div>
        <h2 className="text-xl font-semibold">Error Loading Data</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        {/* <h2 className="text-xl font-semibold">Loading...</h2> */}
        <p className="text-gray-600">Please wait while we fetch the data.</p>
      </div>
    )
  }

  return <>{children}</>
}
