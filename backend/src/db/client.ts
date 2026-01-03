import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Database file location
const DB_DIR = join(__dirname, '../../data')
const DB_PATH = join(DB_DIR, 'kurimasense.db')

// Ensure data directory exists
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true })
}

/**
 * Simple SQLite Database Client
 * No ORM - just raw SQL for maximum performance and simplicity
 */
class DBClient {
  private db: Database.Database

  constructor() {
    this.db = new Database(DB_PATH, {
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
    })

    // Enable WAL mode for better concurrent access
    this.db.pragma('journal_mode = WAL')

    // Initialize schema
    this.initSchema()
  }

  /**
   * Initialize database schema
   */
  private initSchema(): void {
    this.db.exec(`
      -- Satellite data table
      CREATE TABLE IF NOT EXISTS satellite_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        field_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        source TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        ndvi_mean REAL NOT NULL,
        ndvi_min REAL NOT NULL,
        ndvi_max REAL NOT NULL,
        ndvi_std_dev REAL NOT NULL,
        cloud_coverage REAL,
        resolution REAL,
        raw_data TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(field_id, timestamp, source)
      );

      -- Weather data table
      CREATE TABLE IF NOT EXISTS weather_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        field_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        source TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        temperature REAL NOT NULL,
        humidity REAL NOT NULL,
        precipitation REAL NOT NULL,
        wind_speed REAL NOT NULL,
        wind_direction REAL,
        pressure REAL,
        solar_radiation REAL,
        raw_data TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(field_id, timestamp, source)
      );

      -- Weather forecast table
      CREATE TABLE IF NOT EXISTS weather_forecast (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        weather_data_id INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        temperature REAL NOT NULL,
        humidity REAL NOT NULL,
        precipitation_probability REAL NOT NULL,
        precipitation REAL NOT NULL,
        FOREIGN KEY (weather_data_id) REFERENCES weather_data(id) ON DELETE CASCADE
      );

      -- Indexes for faster queries
      CREATE INDEX IF NOT EXISTS idx_satellite_field_timestamp ON satellite_data(field_id, timestamp);
      CREATE INDEX IF NOT EXISTS idx_weather_field_timestamp ON weather_data(field_id, timestamp);
      CREATE INDEX IF NOT EXISTS idx_forecast_weather_id ON weather_forecast(weather_data_id);
    `)
  }

  /**
   * Execute a raw SQL query
   */
  query<T = any>(sql: string, params?: any[]): T[] {
    try {
      const stmt = this.db.prepare(sql)
      return stmt.all(params) as T[]
    } catch (error) {
      console.error('Query error:', error)
      throw error
    }
  }

  /**
   * Execute a query and return a single row
   */
  queryOne<T = any>(sql: string, params?: any[]): T | null {
    try {
      const stmt = this.db.prepare(sql)
      return (stmt.get(params) as T) || null
    } catch (error) {
      console.error('QueryOne error:', error)
      throw error
    }
  }

  /**
   * Execute an insert/update/delete statement
   */
  run(sql: string, params?: any[]): Database.RunResult {
    try {
      const stmt = this.db.prepare(sql)
      return stmt.run(params)
    } catch (error) {
      console.error('Run error:', error)
      throw error
    }
  }

  /**
   * Execute multiple statements in a transaction
   */
  transaction<T>(callback: () => T): T {
    const trx = this.db.transaction(callback)
    return trx()
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close()
  }

  /**
   * Get the underlying database instance (for advanced use)
   */
  getConnection(): Database.Database {
    return this.db
  }
}

// Export singleton instance
export const db = new DBClient()
export default db
