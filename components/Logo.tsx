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
        src="/kurimasense-icon.png"
        alt="KurimaSense"
        width={40}
        height={40}
        className="h-8 w-8"
        priority
      />
    </div>
  )
}

