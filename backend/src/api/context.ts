/**
 * Context API
 * Phase 5 — Context Expansion
 * 
 * Provides read-only context data for analysis runs.
 * Context is descriptive only and does not influence inference.
 * 
 * STRICT RULES:
 * - Context is NOT persisted
 * - Context is NOT stored as historical truth
 * - Context does NOT modify inference
 * - Context is loaded only via explicit user action
 */

import express, { Request, Response } from 'express'

const router = express.Router()

/**
 * GET /api/context/:fieldId
 * Get context data for a field and time window
 * 
 * Query Parameters:
 * - windowStart: ISO 8601 timestamp (required)
 * - windowEnd: ISO 8601 timestamp (required)
 * 
 * Returns: Context data with source, time window, freshness, and descriptive data
 * 
 * Contract: Context is read-only and descriptive only. Not persisted.
 */
router.get('/:fieldId', (req: Request, res: Response) => {
  try {
    const { fieldId } = req.params
    const { windowStart, windowEnd } = req.query

    if (!windowStart || typeof windowStart !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'windowStart is required'
      })
    }

    if (!windowEnd || typeof windowEnd !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'windowEnd is required'
      })
    }

    // Phase 5: Context is descriptive only
    // For now, return mock context data structure
    // In a real implementation, this would fetch from satellite/weather APIs
    // but NOT store or persist the data
    
    const context = {
      source: 'Satellite and Weather APIs',
      timeWindow: {
        start: windowStart,
        end: windowEnd,
      },
      fetchedAt: new Date().toISOString(),
      data: {
        'Satellite observations': 'Available',
        'Weather records': 'Available',
        'Data coverage': 'Complete',
      },
    }

    res.json({
      success: true,
      data: context,
    })
  } catch (error) {
    console.error('Error fetching context:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch context data',
    })
  }
})

export default router

