# KurimaSense Backend

Backend API services for satellite and weather data ingestion.

## Installation

```bash
cd backend
npm install
```

## Running

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:3001` by default.

## API Endpoints

### Satellite Data

**POST /api/satellite**
- Accepts raw satellite data payload
- Validates with Zod schema
- Persists without modification
- Returns storage confirmation

**GET /api/satellite/:fieldId**
- Retrieves all satellite data for a field
- Returns data sorted by timestamp (newest first)

### Weather Data

**POST /api/weather**
- Accepts raw weather data payload
- Validates with Zod schema
- Persists without modification
- Returns storage confirmation

**GET /api/weather/:fieldId**
- Retrieves all weather data for a field
- Returns data sorted by timestamp (newest first)

### Health Check

**GET /health**
- Returns server status and timestamp

## Data Storage

Data is stored in `backend/data/` as JSON files:
- `satellite/` - Satellite payloads
- `weather/` - Weather payloads

Files are named: `{type}-{fieldId}-{timestamp}.json`

## Schema Validation

All payloads are validated using Zod schemas:
- `src/schemas/satellite.js` - Satellite data schema
- `src/schemas/weather.js` - Weather data schema

Validation errors return 400 with detailed error messages.
