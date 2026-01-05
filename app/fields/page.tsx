'use client'

/**
 * Fields Page
 * Phase 4.1 — Field Entity
 * 
 * Minimal UI for field management:
 * - List all fields
 * - Create new fields (name only, geometry optional)
 * - Follow UI/UX contract (calm, analytical, presentational only)
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Map, Plus, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { fetchAllFields, createField, type Field } from '@/app/lib/api'
import { formatFieldCreatedAt } from '@/app/lib/fieldAdapter'

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newFieldName, setNewFieldName] = useState('')

  // Load fields on mount
  useEffect(() => {
    loadFields()
  }, [])

  async function loadFields() {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchAllFields()
      setFields(data)
    } catch (err) {
      console.error('Failed to load fields:', err)
      setError(err instanceof Error ? err.message : 'Failed to load fields')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateField(e: React.FormEvent) {
    e.preventDefault()
    
    if (!newFieldName.trim()) {
      return
    }

    try {
      setIsCreating(true)
      setError(null)
      await createField({
        name: newFieldName.trim(),
        geometry: null, // Geometry optional for Phase 4.1
      })
      setNewFieldName('')
      await loadFields()
    } catch (err) {
      console.error('Failed to create field:', err)
      setError(err instanceof Error ? err.message : 'Failed to create field')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <main className="dashboard-shell">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8">

        {/* ===== HEADER SECTION ===== */}
        <div className="dashboard-section dashboard-section-header mb-12">
          <div className="max-w-3xl">
            <header className="dashboard-header dashboard-section-tight">
              <span className="meta-text uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>Field Management</span>
              <h1 className="page-title mb-6" style={{ lineHeight: '1.1', letterSpacing: '-0.04em' }}>Fields</h1>
              <p className="meta-text mt-1">Manage your agricultural fields</p>
            </header>
          </div>
        </div>

        {/* ===== CREATE FIELD SECTION ===== */}
        <div className="dashboard-section dashboard-section-controls mb-10">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="surface p-6">
              <form onSubmit={handleCreateField} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label htmlFor="field-name" className="label-text block mb-2">
                    Field Name
                  </label>
                  <input
                    id="field-name"
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="Enter field name"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-soft border border-subtle text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green/50 transition-all"
                    disabled={isCreating}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isCreating || !newFieldName.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isCreating ? 'Creating...' : 'Create Field'}
                </button>
              </form>
            </Card>
          </motion.div>
        </div>

        {/* ===== ERROR MESSAGE ===== */}
        {error && (
          <div className="dashboard-section mb-6">
            <Card className="surface-soft p-4 border-l-4 border-red-500">
              <p className="label-text text-red-600 dark:text-red-400">{error}</p>
            </Card>
          </div>
        )}

        {/* ===== FIELDS LIST SECTION ===== */}
        <div className="dashboard-section dashboard-section-table mt-10">
          <section aria-labelledby="fields-heading" className="dashboard-section">
            <div className="flex items-center justify-between mb-4">
              <h2 id="fields-heading" className="section-heading text-lg font-semibold">
                Your Fields
              </h2>
              <p className="meta-text">
                {fields.length} {fields.length === 1 ? 'field' : 'fields'}
              </p>
            </div>

            {isLoading ? (
              <Card className="surface p-12">
                <div className="text-center text-gray-500">Loading fields...</div>
              </Card>
            ) : fields.length === 0 ? (
              <Card className="surface p-12">
                <div className="text-center">
                  <Map className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="label-text mb-2">No fields yet</p>
                  <p className="meta-text">Create your first field to get started</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map((field) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="surface p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Map className="w-4 h-4 opacity-60" />
                          <h3 className="font-semibold text-base">{field.name}</h3>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-3.5 h-3.5 opacity-50" />
                          <span className="meta-text">
                            Created {formatFieldCreatedAt(field.createdAt)}
                          </span>
                        </div>
                        
                        {field.geometry ? (
                          <div className="meta-text text-xs">
                            Geometry defined
                          </div>
                        ) : (
                          <div className="meta-text text-xs opacity-50">
                            No geometry
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>

</div>
</main>
)
}
 