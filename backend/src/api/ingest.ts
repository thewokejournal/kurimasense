import express from 'express'
import satellitePayloadSchema from '../types/satellite.js'
import weatherPayloadSchema from '../types/weather.js'
import { insertSatelliteRecord, insertWeatherRecord } from '../db/client.js'

const router = express.Router()

/**
 * POST /api/ingest/satellite
 * Ingest raw satellite data
 */
router.post('/satellite', async (req, res) => {
  try {
    // Validate payload
    const validated = satellitePayloadSchema.parse(req.body)
    
    // Store raw record
    const result = insertSatelliteRecord(validated)
    
    res.status(201).json({
      success: true,
      message: 'Satellite data ingested',
      id: result.id
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      })
    }
    
    console.error('Satellite ingestion error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to ingest satellite data'
    })
  }
})

/**
 * POST /api/ingest/weather
 * Ingest raw weather data
 */
router.post('/weather', async (req, res) => {
  try {
    // Validate payload
    const validated = weatherPayloadSchema.parse(req.body)
    
    // Store raw record
    const result = insertWeatherRecord(validated)
    
    res.status(201).json({
      success: true,
      message: 'Weather data ingested',
      id: result.id
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      })
    }
    
    console.error('Weather ingestion error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to ingest weather data'
    })
  }
})

export default router
