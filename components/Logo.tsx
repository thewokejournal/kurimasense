'use client'

/**
 * Logo Component
 * Dashboard logo image
 */

import Image from 'next/image'

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/kurimasense-dash-logo.png"
        alt="KurimaSense"
        width={180}
        height={50}
        className="h-8 w-auto"
        priority
      />
    </div>
  )
}

