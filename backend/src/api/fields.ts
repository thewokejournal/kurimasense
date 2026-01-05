import express, { Request, Response } from 'express'
import { randomUUID } from 'crypto'
import {
  insertField,
  getFieldById,
  getAllFields,
  updateField,
  deleteField
} from '../db/client.js'
import type { CreateFieldInput, UpdateFieldInput } from '../types/field.js'

const router = express.Router()

/**
 * GET /api/fields
 * Get all fields
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const fields = getAllFields()
    res.json({
      success: true,
      data: fields
    })
  } catch (error) {
    console.error('Error fetching fields:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fields'
    })
  }
})

/**
 * GET /api/fields/:id
 * Get a field by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const field = getFieldById(id)
    
    if (!field) {
      return res.status(404).json({
        success: false,
        error: 'Field not found'
      })
    }
    
    res.json({
      success: true,
      data: field
    })
  } catch (error) {
    console.error('Error fetching field:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch field'
    })
  }
})

/**
 * POST /api/fields
 * Create a new field
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, geometry }: CreateFieldInput = req.body
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Field name is required'
      })
    }
    
    // Generate stable ID (UUID)
    const id = randomUUID()
    
    // Create field
    insertField(id, name.trim(), geometry || null)
    
    // Fetch created field
    const field = getFieldById(id)
    
    res.status(201).json({
      success: true,
      data: field
    })
  } catch (error) {
    console.error('Error creating field:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create field'
    })
  }
})

/**
 * PUT /api/fields/:id
 * Update a field
 */
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, geometry }: UpdateFieldInput = req.body
    
    // Check if field exists
    const existingField = getFieldById(id)
    if (!existingField) {
      return res.status(404).json({
        success: false,
        error: 'Field not found'
      })
    }
    
    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Field name must be a non-empty string'
        })
      }
    }
    
    // Update field
    const trimmedName = name !== undefined ? name.trim() : undefined
    updateField(id, trimmedName, geometry)
    
    // Fetch updated field
    const field = getFieldById(id)
    
    res.json({
      success: true,
      data: field
    })
  } catch (error) {
    console.error('Error updating field:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update field'
    })
  }
})

/**
 * DELETE /api/fields/:id
 * Delete a field
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // Check if field exists
    const existingField = getFieldById(id)
    if (!existingField) {
      return res.status(404).json({
        success: false,
        error: 'Field not found'
      })
    }
    
    // Delete field
    deleteField(id)
    
    res.json({
      success: true,
      message: 'Field deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting field:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete field'
    })
  }
})

export default router

