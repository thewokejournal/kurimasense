import express from 'express'
import { satellitePayloadSchema, weatherPayloadSchema } from '../types/contracts.js'
import { insertSatelliteRecord, insertWeatherRecord } from '../db/client.js'

const router = express.Router()

/**
 * POST /api/ingest/satellite
 * Accept raw satellite data, validate, and store
 */
router.post('/satellite', (req, res) => {
  try {
    // Validate payload
    const validated = satellitePayloadSchema.parse(req.body)
    
    // Store raw payload without transformation
    const result = insertSatelliteRecord(validated)
    
    res.status(201).json({
      success: true,
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
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

/**
 * POST /api/ingest/weather
 * Accept raw weather data, validate, and store
 */
router.post('/weather', (req, res) => {
  try {
    // Validate payload
    const validated = weatherPayloadSchema.parse(req.body)
    
    // Store raw payload without transformation
    const result = insertWeatherRecord(validated)
    
    res.status(201).json({
      success: true,
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
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
