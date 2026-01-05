import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { initializeSchema } from './schema.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DB_DIR = join(__dirname, '../../data')
const DB_PATH = join(DB_DIR, 'kurimasense.db')

if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true })
}

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')

// Initialize raw records tables
db.exec(`
  CREATE TABLE IF NOT EXISTS satellite_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payload TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS weather_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payload TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`)

// Initialize signal tables
initializeSchema(db)

/**
 * Insert raw satellite record
 */
export function insertSatelliteRecord(payload: any) {
  const stmt = db.prepare('INSERT INTO satellite_records (payload) VALUES (?)')
  const result = stmt.run(JSON.stringify(payload))
  return { id: result.lastInsertRowid }
}

/**
 * Insert raw weather record
 */
export function insertWeatherRecord(payload: any) {
  const stmt = db.prepare('INSERT INTO weather_records (payload) VALUES (?)')
  const result = stmt.run(JSON.stringify(payload))
  return { id: result.lastInsertRowid }
}

/**
 * Insert vegetation signal
 */
export function insertVegetationSignal(signal: any) {
  const stmt = db.prepare(`
    INSERT INTO vegetation_signals (
      field_id, timestamp, ndvi_mean, ndvi_min, ndvi_max, ndvi_std_dev, data_quality
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    signal.fieldId,
    signal.timestamp,
    signal.ndvi.mean,
    signal.ndvi.min,
    signal.ndvi.max,
    signal.ndvi.stdDev,
    signal.dataQuality
  )
  return { id: result.lastInsertRowid }
}

/**
 * Insert weather signal
 */
export function insertWeatherSignal(signal: any) {
  const stmt = db.prepare(`
    INSERT INTO weather_signals (
      field_id, timestamp, rainfall_mm, temperature_c, data_quality
    ) VALUES (?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    signal.fieldId,
    signal.timestamp,
    signal.rainfall,
    signal.temperature,
    signal.dataQuality
  )
  return { id: result.lastInsertRowid }
}

/**
 * Field Persistence Functions
 */

/**
 * Create a new field
 */
export function insertField(id: string, name: string, geometry?: string | null) {
  const stmt = db.prepare(`
    INSERT INTO fields (id, name, geometry, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `)
  const result = stmt.run(id, name, geometry || null)
  return { id }
}

/**
 * Get a field by ID
 */
export function getFieldById(id: string) {
  const stmt = db.prepare('SELECT * FROM fields WHERE id = ?')
  const row = stmt.get(id) as any
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    geometry: row.geometry,
    createdAt: row.created_at
  }
}

/**
 * Get all fields
 */
export function getAllFields() {
  const stmt = db.prepare('SELECT * FROM fields ORDER BY created_at DESC')
  const rows = stmt.all() as any[]
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    geometry: row.geometry,
    createdAt: row.created_at
  }))
}

/**
 * Update a field
 */
export function updateField(id: string, name?: string, geometry?: string | null) {
  const updates: string[] = []
  const values: any[] = []
  
  if (name !== undefined) {
    updates.push('name = ?')
    values.push(name)
  }
  
  if (geometry !== undefined) {
    updates.push('geometry = ?')
    values.push(geometry || null)
  }
  
  if (updates.length === 0) {
    return { id, updated: false }
  }
  
  values.push(id)
  const stmt = db.prepare(`UPDATE fields SET ${updates.join(', ')} WHERE id = ?`)
  const result = stmt.run(...values)
  return { id, updated: result.changes > 0 }
}

/**
 * Delete a field
 */
export function deleteField(id: string) {
  const stmt = db.prepare('DELETE FROM fields WHERE id = ?')
  const result = stmt.run(id)
  return { id, deleted: result.changes > 0 }
}

export default db
