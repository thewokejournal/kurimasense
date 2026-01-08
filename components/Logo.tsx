'use client'

/**
 * Logo Component
 * Simple icon + "KurimaSense" text lockup
 */

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Mark - Simple Leaf/Growth Icon */}
      <div className="logo-mark">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="logo-icon"
        >
          {/* Stylized leaf/growth symbol */}
          <path
            d="M12 2C12 2 4 6 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14C20 6 12 2 12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M12 22C12 22 8 18 8 14C8 10 12 2 12 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      <span className="logo-text">KurimaSense</span>
    </div>
  )
}

