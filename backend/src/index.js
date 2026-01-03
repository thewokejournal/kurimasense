import express from 'express'
import cors from 'cors'
import satelliteRoutes from './api/satellite.js'
import weatherRoutes from './api/weather.js'
import ingestRoutes from './api/ingest.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/ingest', ingestRoutes)
app.use('/api/satellite', satelliteRoutes)
app.use('/api/weather', weatherRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`KurimaSense Backend running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`Satellite API: http://localhost:${PORT}/api/satellite`)
  console.log(`Weather API: http://localhost:${PORT}/api/weather`)
})
