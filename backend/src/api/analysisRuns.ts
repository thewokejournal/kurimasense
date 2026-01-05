/**
 * Analysis Run API
 * Phase 4.2 — Analysis Run Persistence
 * 
 * STRICT RULES (NON-NEGOTIABLE):
 * - AnalysisRuns are immutable (no update, delete, recomputation)
 * - Created ONLY via explicit user action (no background jobs, auto-analysis)
 * - Data shape is LOCKED and must match canonical contract exactly
 */

import express, { Request, Response } from 'express'
import { randomUUID } from 'crypto'
import {
  insertAnalysisRun,
  getAnalysisRunById,
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
 * POST /api/analysis-runs
 * Create a new AnalysisRun (immutable snapshot)
 * 
 * Body:
 * - fieldId: string (required)
 * - windowStart: ISO 8601 timestamp (required)
 * - windowEnd: ISO 8601 timestamp (required)
 * 
 * Runs inference deterministically, stores as AnalysisRun, returns stored result.
 * 
 * Contract: AnalysisRuns are immutable and created ONLY via explicit user action.
 */
router.post('/', (req: Request, res: Response) => {
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

    // Validate windowStart < windowEnd
    if (new Date(windowStart) >= new Date(windowEnd)) {
      return res.status(400).json({
        success: false,
        error: 'windowStart must be before windowEnd'
      })
    }

    // Run inference computation (deterministic, runs exactly once)
    const input = assembleInferenceInput(fieldId, windowStart, windowEnd)
    const status = inferCropHealthStatus(input)
    const category = emitInferenceCategory(status, input)
    const inference = assembleInference(status, category, input)

    // Transform to canonical API response
    const inferenceResponse = toInferenceResponse(inference)

    // Validate response against schema
    const validationResult = inferenceResponseSchema.safeParse(inferenceResponse)
    if (!validationResult.success) {
      console.error('Inference response validation failed:', validationResult.error)
      return res.status(500).json({
        success: false,
        error: 'Invalid inference response structure',
        details: validationResult.error.errors
      })
    }

    // Generate stable ID (UUID)
    const id = randomUUID()

    // Store as AnalysisRun (immutable snapshot)
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
    console.error('Error creating analysis run:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create analysis run'
    })
  }
})

/**
 * GET /api/analysis-runs/:id
 * Get an AnalysisRun by ID
 * 
 * Contract: Returns stored data only, no recomputation
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

export default router
