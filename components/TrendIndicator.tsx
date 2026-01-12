/**
 * TrendIndicator Component
 * 
 * Subtle visual indicator for field health trends.
 * Arrow color intensity reflects stability score.
 */

interface TrendIndicatorProps {
  direction: 'improving' | 'stable' | 'declining'
  stability: number // 0-1
}

export function TrendIndicator({ direction, stability }: TrendIndicatorProps) {
  // Clamp stability between 0 and 1
  const stabilityScore = Math.max(0, Math.min(1, stability))

  // Get arrow icon and label
  const getArrowConfig = () => {
    switch (direction) {
      case 'improving':
        return {
          icon: '↗',
          label: 'Field health improving',
        }
      case 'declining':
        return {
          icon: '↘',
          label: 'Field health declining',
        }
      case 'stable':
        return {
          icon: '→',
          label: 'Field health stable',
        }
    }
  }

  const config = getArrowConfig()

  // Calculate opacity based on stability (0.3 to 1.0 range)
  // Low stability = more transparent, high stability = more opaque
  const opacity = 0.3 + stabilityScore * 0.7

  return (
    <span
      className="inline-block text-sm text-slate-600"
      style={{ opacity }}
      aria-label={`${config.label} (${Math.round(stabilityScore * 100)}% stability)`}
      role="img"
    >
      {config.icon}
    </span>
  )
}
