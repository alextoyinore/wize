"use client"

export default function LoadingIcon({ className = '', size = 48 }) {
  return (
    <div 
      className={`fast-spin rounded-full  border-b-2 border-gray-900 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
    />
  )
}

// Add CSS for faster spin animation
const style = document.createElement('style')
style.textContent = `
  .fast-spin {
    animation: fast-spin 0.5s linear infinite;
  }
  @keyframes fast-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
document.head.appendChild(style)
