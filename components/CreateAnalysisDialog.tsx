'use client'

/**
 * Create Analysis Dialog Component
 * Phase A — Analysis Execution Hardening
 * 
 * Explicit analysis creation with confirmation flow.
 * Shows field and time window before execution.
 * Requires explicit confirmation to proceed.
 */

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { X, Calendar, Map, Clock } from 'lucide-react'
import type { Field } from '@/app/lib/api'

interface CreateAnalysisDialogProps {
  isOpen: boolean
  onClose: () => void
  fields: Field[]
  onCreate: (fieldId: string, windowStart: string, windowEnd: string) => Promise<void>
  isCreating: boolean
  error: string | null
}

export default function CreateAnalysisDialog({
  isOpen,
  onClose,
  fields,
  onCreate,
  isCreating,
  error,
}: CreateAnalysisDialogProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string>('')
  const [windowStart, setWindowStart] = useState<string>('')
  const [windowEnd, setWindowEnd] = useState<string>('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  if (!isOpen) return null

  const selectedField = fields.find(f => f.id === selectedFieldId)

  // Phase A: Client-side validation before showing confirmation
  const validateTimeWindow = (start: string, end: string): string | null => {
    if (!start || !end) {
      return null // Let required attribute handle empty fields
    }
    const startDate = new Date(start)
    const endDate = new Date(end)
    if (startDate >= endDate) {
      return 'Window start must be before window end'
    }
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFieldId || !windowStart || !windowEnd) {
      return
    }
    
    // Phase A: Validate time window before showing confirmation
    const timeError = validateTimeWindow(windowStart, windowEnd)
    if (timeError) {
      setValidationError(timeError)
      return
    }
    
    setValidationError(null)
    setShowConfirmation(true)
  }

  const handleConfirm = async () => {
    if (!selectedFieldId || !windowStart || !windowEnd) {
      return
    }
    
    // Phase A: Final validation before execution
    const timeError = validateTimeWindow(windowStart, windowEnd)
    if (timeError) {
      setValidationError(timeError)
      setShowConfirmation(false)
      return
    }
    
    await onCreate(selectedFieldId, windowStart, windowEnd)
    // Reset form on success
    setSelectedFieldId('')
    setWindowStart('')
    setWindowEnd('')
    setShowConfirmation(false)
    setValidationError(null)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setValidationError(null)
  }
  
  // Phase A: Reset form when dialog closes
  const handleClose = () => {
    setSelectedFieldId('')
    setWindowStart('')
    setWindowEnd('')
    setShowConfirmation(false)
    setValidationError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="surface p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Run Analysis</h2>
          <button
            onClick={handleClose}
            className="text-muted hover:text-primary"
            disabled={isCreating}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showConfirmation ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Field <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Map className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                <select
                  value={selectedFieldId}
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border-subtle rounded-md bg-background-secondary focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isCreating}
                >
                  <option value="">Select a field</option>
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time Window Start */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Window Start <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                <input
                  type="datetime-local"
                  value={windowStart}
                  onChange={(e) => {
                    setWindowStart(e.target.value)
                    // Phase A: Clear validation error when user changes input
                    if (validationError) {
                      setValidationError(null)
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-border-subtle rounded-md bg-background-secondary focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isCreating}
                />
              </div>
            </div>

            {/* Time Window End */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Window End <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                <input
                  type="datetime-local"
                  value={windowEnd}
                  onChange={(e) => {
                    setWindowEnd(e.target.value)
                    // Phase A: Clear validation error when user changes input
                    if (validationError) {
                      setValidationError(null)
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-border-subtle rounded-md bg-background-secondary focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isCreating}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 btn-secondary"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={isCreating || !selectedFieldId || !windowStart || !windowEnd}
              >
                {isCreating ? 'Creating...' : 'Continue'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Confirm Analysis Creation</h3>
              <p className="text-xs text-muted mb-3">
                This will create a new immutable analysis record. The analysis cannot be modified or deleted after creation.
              </p>
              <div className="space-y-3 p-4 bg-surface-soft rounded-md">
                <div className="flex items-start gap-2">
                  <Map className="w-4 h-4 mt-0.5 opacity-50" />
                  <div>
                    <p className="text-xs text-muted mb-1">Field</p>
                    <p className="text-sm font-medium">{selectedField?.name || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 opacity-50" />
                  <div>
                    <p className="text-xs text-muted mb-1">Time Window</p>
                    <p className="text-sm font-medium">
                      {new Date(windowStart).toLocaleString()} — {new Date(windowEnd).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 btn-secondary"
                disabled={isCreating}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 btn-primary"
                disabled={isCreating}
              >
                {isCreating ? 'Running Analysis...' : 'Run Analysis'}
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

