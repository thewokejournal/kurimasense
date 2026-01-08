'use client'

/**
 * Left Sidebar Component
 * Contains field selector, metrics with icons, and analysis run charts
 */

import { Map, Leaf, Thermometer, Droplet, Wind, Sun } from 'lucide-react'

interface LeftSidebarProps {
  selectedFieldId: string
  fields: Array<{ id: string; name: string; location?: string }>
  onFieldSelect?: (fieldId: string) => void
}

export function LeftSidebar({ selectedFieldId, fields, onFieldSelect }: LeftSidebarProps) {
  const selectedField = fields.find(f => f.id === selectedFieldId)

  return (
    <div className="left-sidebar">
      {/* Field Selector */}
      <div className="metric-card">
        <div className="metric-icon">
          <Map className="w-5 h-5" />
        </div>
        <div className="metric-content">
          <div className="metric-label">Current Field</div>
          <div className="text-base font-semibold text-primary">
            {selectedField?.name || 'Select Field'}
          </div>
          {selectedField?.location && (
            <div className="metric-meta">{selectedField.location}</div>
          )}
        </div>
      </div>

      {/* Metrics Section */}
      <div className="space-y-3">
        <div className="px-2">
          <span className="meta-text uppercase tracking-wider text-xs">Field Metrics</span>
        </div>

        {/* Canopy Health */}
        <div className="metric-card">
          <div className="metric-icon">
            <Leaf className="w-5 h-5" />
          </div>
          <div className="metric-content">
            <div className="metric-label">Canopy Health</div>
            <div className="metric-value">82</div>
            <div className="metric-meta">Index value</div>
          </div>
        </div>

        {/* Temperature */}
        <div className="metric-card">
          <div className="metric-icon">
            <Thermometer className="w-5 h-5" />
          </div>
          <div className="metric-content">
            <div className="metric-label">Temperature</div>
            <div className="metric-value">24°C</div>
            <div className="metric-meta">Current</div>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="metric-card">
          <div className="metric-icon">
            <Droplet className="w-5 h-5" />
          </div>
          <div className="metric-content">
            <div className="metric-label">Soil Moisture</div>
            <div className="metric-value">68%</div>
            <div className="metric-meta">Optimal range</div>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="metric-card">
          <div className="metric-icon">
            <Wind className="w-5 h-5" />
          </div>
          <div className="metric-content">
            <div className="metric-label">Wind Speed</div>
            <div className="metric-value">12 km/h</div>
            <div className="metric-meta">Average</div>
          </div>
        </div>

        {/* Solar Radiation */}
        <div className="metric-card">
          <div className="metric-icon">
            <Sun className="w-5 h-5" />
          </div>
          <div className="metric-content">
            <div className="metric-label">Solar Radiation</div>
            <div className="metric-value">850 W/m²</div>
            <div className="metric-meta">Peak today</div>
          </div>
        </div>
      </div>
    </div>
  )
}

