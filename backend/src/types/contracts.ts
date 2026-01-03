import { z } from 'zod'

/**
 * Satellite Data Contract
 * Validates raw satellite imagery and NDVI data
 */
export const satellitePayloadSchema = z.object({
  fieldId: z.string().min(1),
  timestamp: z.string().datetime(),
  source: z.enum(['sentinel-2', 'landsat-8', 'planet']),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  ndvi: z.object({
    mean: z.number().min(-1).max(1),
    min: z.number().min(-1).max(1),
    max: z.number().min(-1).max(1),
    stdDev: z.number().min(0),
  }),
  metadata: z.object({
    cloudCoverage: z.number().min(0).max(100),
    resolution: z.number().positive(),
    bandData: z.record(z.number()).optional(),
  }).optional(),
  rawData: z.any().optional(),
})

/**
 * Weather Data Contract
 * Validates raw weather station and forecast data
 */
export const weatherPayloadSchema = z.object({
  fieldId: z.string().min(1),
  timestamp: z.string().datetime(),
  source: z.enum(['weather-station', 'openweather', 'noaa', 'forecast']),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  current: z.object({
    temperature: z.number(),
    humidity: z.number().min(0).max(100),
    precipitation: z.number().min(0),
    windSpeed: z.number().min(0),
    windDirection: z.number().min(0).max(360).optional(),
    pressure: z.number().positive().optional(),
    solarRadiation: z.number().min(0).optional(),
  }),
  forecast: z.array(z.object({
    timestamp: z.string().datetime(),
    temperature: z.number(),
    humidity: z.number().min(0).max(100),
    precipitationProbability: z.number().min(0).max(100),
    precipitation: z.number().min(0),
  })).optional(),
  metadata: z.object({
    stationId: z.string().optional(),
    dataQuality: z.enum(['high', 'medium', 'low']).optional(),
  }).optional(),
  rawData: z.any().optional(),
})
