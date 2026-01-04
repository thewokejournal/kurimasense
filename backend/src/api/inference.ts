/**
 * Inference API
 * Endpoint for retrieving field inference results
 */

import { Router, Request, Response } from 'express'
import {
  assembleInferenceInput,
  inferCropHealthStatus,
  emitInferenceCategory,
  assembleInference,
} from '../inference/index.js'

const router = Router()

/**
 * GET /api/inference
 * 
 * Query Parameters:
 * - fieldId: string (required)
 * - windowStart: ISO 8601 timestamp (required)
 * - windowEnd: ISO 8601 timestamp (required)
 * 
 * Returns: Inference object as JSON
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { fieldId, windowStart, windowEnd } = req.query

    // Validate required parameters
    if (!fieldId || typeof fieldId !== 'string') {
      return res.status(400).json({ error: 'fieldId is required' })
    }
    if (!windowStart || typeof windowStart !== 'string') {
      return res.status(400).json({ error: 'windowStart is required' })
    }
    if (!windowEnd || typeof windowEnd !== 'string') {
      return res.status(400).json({ error: 'windowEnd is required' })
    }

    // Assemble inference input from database
    const input = assembleInferenceInput(fieldId, windowStart, windowEnd)

    // Derive status from vegetation signals
    const status = inferCropHealthStatus(input)

    // Emit category based on status
    const category = emitInferenceCategory(status, input)

    // Assemble final inference object
    const inference = assembleInference(status, category, input)

    // Return as JSON
    res.json(inference)
  } catch (error) {
    console.error('Inference error:', error)
    res.status(500).json({ error: 'Failed to generate inference' })
  }
})

export default router
