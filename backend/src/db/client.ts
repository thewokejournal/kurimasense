import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DB_DIR = join(__dirname, '../../data')
const DB_PATH = join(DB_DIR, 'kurimasense.db')

if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true })
}

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')

// Simple tables: just store raw JSON payloads
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

export default db
