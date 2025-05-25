import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { format } from 'date-fns'

const SEVERITY_COLORS = {
  info: 'bg-blue-50 border-blue-200 text-blue-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  error: 'bg-red-50 border-red-200 text-red-700',
  critical: 'bg-red-50 border-red-200 text-red-700'
}

export default function NotificationCard({ notification, onMarkAsRead }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleRead = () => {
    if (notification.read) return
    onMarkAsRead(notification._id)
  }

  return (
    <div
      className={`p-4 mb-4 rounded-lg border ${
        SEVERITY_COLORS[notification.severity || 'info']
      } transition-all cursor-pointer hover:shadow-md`}
      onClick={handleRead}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium mb-1">{notification.message}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {notification.type} • {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </p>
          
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div className="mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? 'Hide Details' : 'Show Details'}
              </button>
              
              {isExpanded && (
                <div className="mt-2 text-sm text-gray-600">
                  {Object.entries(notification.metadata).map(([key, value]) => (
                    <div key={key} className="mb-1">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          {!notification.read && (
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRead()
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Mark as Read
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
