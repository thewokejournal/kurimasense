/**
 * Database Schema
 * Minimal and auditable tables for signal storage
 */

export const VEGETATION_SIGNALS_TABLE = `
  CREATE TABLE IF NOT EXISTS vegetation_signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    ndvi_mean REAL NOT NULL,
    ndvi_min REAL NOT NULL,
    ndvi_max REAL NOT NULL,
    ndvi_std_dev REAL NOT NULL,
    data_quality TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`

export const WEATHER_SIGNALS_TABLE = `
  CREATE TABLE IF NOT EXISTS weather_signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    rainfall_mm REAL NOT NULL,
    temperature_c REAL NOT NULL,
    data_quality TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`

export const FIELDS_TABLE = `
  CREATE TABLE IF NOT EXISTS fields (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    geometry TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`

export const ANALYSIS_RUNS_TABLE = `
  CREATE TABLE IF NOT EXISTS analysis_runs (
    id TEXT PRIMARY KEY,
    field_id TEXT NOT NULL,
    window_start TEXT NOT NULL,
    window_end TEXT NOT NULL,
    inference_response TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`

export const SEASONS_TABLE = `
  CREATE TABLE IF NOT EXISTS seasons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`

export function initializeSchema(db: any): void {
  db.exec(VEGETATION_SIGNALS_TABLE)
  db.exec(WEATHER_SIGNALS_TABLE)
  db.exec(FIELDS_TABLE)
  db.exec(ANALYSIS_RUNS_TABLE)
  db.exec(SEASONS_TABLE)
}
