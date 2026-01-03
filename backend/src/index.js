import express from 'express'
import cors from 'cors'
import satelliteRouter from './routes/satellite.js'
import weatherRouter from './routes/weather.js'

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
app.use('/api/satellite', satelliteRouter)
app.use('/api/weather', weatherRouter)

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
