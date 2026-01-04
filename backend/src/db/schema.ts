/**
 * Database Schema
 * SQL table definitions for signal storage
 */

export const VEGETATION_SIGNALS_TABLE = `
  CREATE TABLE IF NOT EXISTS vegetation_signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    ndvi REAL NOT NULL,
    data_quality TEXT NOT NULL CHECK(data_quality IN ('high', 'medium', 'low')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(field_id, timestamp)
  )
`

export const WEATHER_SIGNALS_TABLE = `
  CREATE TABLE IF NOT EXISTS weather_signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    rainfall_mm REAL NOT NULL,
    temperature_c REAL NOT NULL,
    data_quality TEXT NOT NULL CHECK(data_quality IN ('high', 'medium', 'low')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(field_id, timestamp)
  )
`

export const INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_vegetation_field_timestamp ON vegetation_signals(field_id, timestamp);
  CREATE INDEX IF NOT EXISTS idx_weather_field_timestamp ON weather_signals(field_id, timestamp);
`

export function initializeSchema(db: any): void {
  db.exec(VEGETATION_SIGNALS_TABLE)
  db.exec(WEATHER_SIGNALS_TABLE)
  db.exec(INDEXES)
}
