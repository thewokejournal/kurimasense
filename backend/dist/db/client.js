import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { initializeSchema } from './schema.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_DIR = join(__dirname, '../../data');
const DB_PATH = join(DB_DIR, 'kurimasense.db');
if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
}
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
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
`);
// Initialize signal tables
initializeSchema(db);
/**
 * Insert raw satellite record
 */
export function insertSatelliteRecord(payload) {
    const stmt = db.prepare('INSERT INTO satellite_records (payload) VALUES (?)');
    const result = stmt.run(JSON.stringify(payload));
    return { id: result.lastInsertRowid };
}
/**
 * Insert raw weather record
 */
export function insertWeatherRecord(payload) {
    const stmt = db.prepare('INSERT INTO weather_records (payload) VALUES (?)');
    const result = stmt.run(JSON.stringify(payload));
    return { id: result.lastInsertRowid };
}
/**
 * Insert vegetation signal
 */
export function insertVegetationSignal(signal) {
    const stmt = db.prepare(`
    INSERT INTO vegetation_signals (
      field_id, timestamp, ndvi_mean, ndvi_min, ndvi_max, ndvi_std_dev, data_quality
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    const result = stmt.run(signal.fieldId, signal.timestamp, signal.ndvi.mean, signal.ndvi.min, signal.ndvi.max, signal.ndvi.stdDev, signal.dataQuality);
    return { id: result.lastInsertRowid };
}
/**
 * Insert weather signal
 */
export function insertWeatherSignal(signal) {
    const stmt = db.prepare(`
    INSERT INTO weather_signals (
      field_id, timestamp, rainfall_mm, temperature_c, data_quality
    ) VALUES (?, ?, ?, ?, ?)
  `);
    const result = stmt.run(signal.fieldId, signal.timestamp, signal.rainfall, signal.temperature, signal.dataQuality);
    return { id: result.lastInsertRowid };
}
export default db;
