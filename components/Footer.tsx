'use client'

/**
 * Footer Component
 * Simple footer to mark the end of page content and prevent infinite scroll
 */

export default function Footer() {
  return (
    <footer className="w-full mt-16 mb-8 pt-8 border-t border-border-subtle">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <p className="text-xs text-muted text-center">
          KurimaSense — Crop Health Monitoring
        </p>
      </div>
    </footer>
  )
}

