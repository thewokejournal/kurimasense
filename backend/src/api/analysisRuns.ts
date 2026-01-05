import express, { Request, Response } from 'express'
import { randomUUID } from 'crypto'
import {
  insertAnalysisRun,
  getAnalysisRunById,
  getAnalysisRunsByFieldId,
  getAnalysisRunByFieldAndWindow,
  getAllAnalysisRuns,
  deleteAnalysisRun
} from '../db/client.js'
import type { CreateAnalysisRunInput } from '../types/analysisRun.js'
import { inferenceResponseSchema } from '../types/contracts.js'
import {
  assembleInferenceInput,
  inferCropHealthStatus,
  emitInferenceCategory,
  assembleInference,
  type Inference,
} from '../inference/index.js'
import type { InferenceResponse } from '../types/api.js'

const router = express.Router()

/**
 * Transform internal Inference to canonical InferenceResponse
 */
function toInferenceResponse(inference: Inference): InferenceResponse {
  // Convert numeric confidence to categorical
  let confidence: 'high' | 'medium' | 'low'
  if (inference.confidence >= 70) {
    confidence = 'high'
  } else if (inference.confidence >= 40) {
    confidence = 'medium'
  } else {
    confidence = 'low'
  }

  // Extract status string (default to 'watch' if null)
  const status = inference.status?.status || 'watch'

  // Trend is stable for now (no trend inference yet)
  const trend = 'stable' as const

  return {
    fieldId: inference.fieldId,
    generatedAt: inference.timestamp,
    status,
    trend,
    confidence,
    categories: [inference.category],
    explanation: inference.explanation,
  }
}

/**
 * GET /api/analysis-runs
 * Get all analysis runs (optionally filtered by fieldId)
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const { fieldId } = req.query
    
    if (fieldId && typeof fieldId === 'string') {
      const runs = getAnalysisRunsByFieldId(fieldId)
      return res.json({
        success: true,
        data: runs
      })
    }
    
    const runs = getAllAnalysisRuns()
    res.json({
      success: true,
      data: runs
    })
  } catch (error) {
    console.error('Error fetching analysis runs:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis runs'
    })
  }
})

/**
 * POST /api/analysis-runs/trigger
 * Manual analysis trigger: runs inference, stores as AnalysisRun, and returns the result
 * 
 * Body:
 * - fieldId: string (required)
 * - windowStart: ISO 8601 timestamp (required)
 * - windowEnd: ISO 8601 timestamp (required)
 * 
 * Returns: Stored AnalysisRun object
 */
router.post('/trigger', (req: Request, res: Response) => {
  try {
    const { fieldId, windowStart, windowEnd } = req.body

    // Validate required parameters
    if (!fieldId || typeof fieldId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'fieldId is required'
      })
    }
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

    // Run inference computation
    const input = assembleInferenceInput(fieldId, windowStart, windowEnd)
    const status = inferCropHealthStatus(input)
    const category = emitInferenceCategory(status, input)
    const inference = assembleInference(status, category, input)

    // Transform to canonical API response
    const inferenceResponse = toInferenceResponse(inference)

    // Validate response against schema
    const validationResult = inferenceResponseSchema.safeParse(inferenceResponse)
    if (!validationResult.success) {
      console.error('Response validation failed:', validationResult.error)
      return res.status(500).json({
        success: false,
        error: 'Invalid inference response structure',
        details: validationResult.error.errors
      })
    }

    // Generate stable ID (UUID)
    const id = randomUUID()

    // Store as AnalysisRun
    insertAnalysisRun(id, fieldId, windowStart, windowEnd, validationResult.data)

    // Fetch and return stored analysis run
    const run = getAnalysisRunById(id)
    
    if (!run) {
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve stored analysis run'
      })
    }

    res.status(201).json({
      success: true,
      data: run
    })
  } catch (error) {
    console.error('Error triggering analysis:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to trigger analysis'
    })
  }
})

/**
 * GET /api/analysis-runs/:id
 * Get an analysis run by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const run = getAnalysisRunById(id)
    
    if (!run) {
      return res.status(404).json({
        success: false,
        error: 'Analysis run not found'
      })
  }
    
    res.json({
      success: true,
      data: run
    })
  } catch (error) {
    console.error('Error fetching analysis run:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis run'
    })
  }
})

/**
 * GET /api/analysis-runs/field/:fieldId/window
 * Get an analysis run by field ID and time window
 * Query params: windowStart, windowEnd
 */
router.get('/field/:fieldId/window', (req: Request, res: Response) => {
  try {
    const { fieldId } = req.params
    const { windowStart, windowEnd } = req.query
    
    if (!windowStart || typeof windowStart !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'windowStart query parameter is required'
      })
    }
    
    if (!windowEnd || typeof windowEnd !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'windowEnd query parameter is required'
      })
    }
    
    const run = getAnalysisRunByFieldAndWindow(fieldId, windowStart, windowEnd)
    
    if (!run) {
      return res.status(404).json({
        success: false,
        error: 'Analysis run not found for the specified field and time window'
      })
    }
    
    res.json({
      success: true,
      data: run
    })
  } catch (error) {
    console.error('Error fetching analysis run:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis run'
    })
  }
})

/**
 * POST /api/analysis-runs
 * Create a new analysis run (store inference result snapshot)
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const { fieldId, windowStart, windowEnd, inferenceResponse }: CreateAnalysisRunInput = req.body
    
    // Validate required fields
    if (!fieldId || typeof fieldId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'fieldId is required'
      })
    }
    
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
    
    if (!inferenceResponse) {
      return res.status(400).json({
        success: false,
        error: 'inferenceResponse is required'
      })
    }
    
    // Validate inference response against schema
    const validationResult = inferenceResponseSchema.safeParse(inferenceResponse)
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid inferenceResponse structure',
        details: validationResult.error.errors
      })
    }
    
    // Generate stable ID (UUID)
    const id = randomUUID()
    
    // Create analysis run
    insertAnalysisRun(id, fieldId, windowStart, windowEnd, validationResult.data)
    
    // Fetch created analysis run
    const run = getAnalysisRunById(id)
    
    res.status(201).json({
      success: true,
      data: run
    })
  } catch (error) {
    console.error('Error creating analysis run:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create analysis run'
    })
  }
})

/**
 * DELETE /api/analysis-runs/:id
 * Delete an analysis run
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // Check if analysis run exists
    const existingRun = getAnalysisRunById(id)
    if (!existingRun) {
      return res.status(404).json({
        success: false,
        error: 'Analysis run not found'
      })
    }
    
    // Delete analysis run
    deleteAnalysisRun(id)
    
    res.json({
      success: true,
      message: 'Analysis run deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting analysis run:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete analysis run'
    })
  }
})

export default router
