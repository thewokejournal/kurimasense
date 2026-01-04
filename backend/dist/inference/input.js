/**
 * Inference Input Assembly
 * Functions to construct InferenceInput from persisted signals
 */
import db from '../db/client.js';
/**
 * Assemble InferenceInput for a given field and time window
 */
export function assembleInferenceInput(fieldId, windowStart, windowEnd) {
    // Query vegetation signals within window
    const vegetationRows = db.prepare(`
    SELECT field_id, timestamp, ndvi_mean, ndvi_min, ndvi_max, ndvi_std_dev, data_quality
    FROM vegetation_signals
    WHERE field_id = ? AND timestamp >= ? AND timestamp <= ?
    ORDER BY timestamp ASC
  `).all(fieldId, windowStart, windowEnd);
    // Query weather signals within window
    const weatherRows = db.prepare(`
    SELECT field_id, timestamp, rainfall_mm, temperature_c, data_quality
    FROM weather_signals
    WHERE field_id = ? AND timestamp >= ? AND timestamp <= ?
    ORDER BY timestamp ASC
  `).all(fieldId, windowStart, windowEnd);
    // Transform database rows to signal objects
    const vegetationSignals = vegetationRows.map((row) => ({
        fieldId: row.field_id,
        timestamp: row.timestamp,
        ndvi: {
            mean: row.ndvi_mean,
            min: row.ndvi_min,
            max: row.ndvi_max,
            stdDev: row.ndvi_std_dev,
        },
        dataQuality: row.data_quality,
    }));
    const weatherSignals = weatherRows.map((row) => ({
        fieldId: row.field_id,
        timestamp: row.timestamp,
        rainfall: row.rainfall_mm,
        temperature: row.temperature_c,
        dataQuality: row.data_quality,
    }));
    // Calculate signal completeness
    const signalCompleteness = calculateSignalCompleteness(windowStart, windowEnd, vegetationSignals.length, weatherSignals.length);
    return {
        fieldId,
        windowStart,
        windowEnd,
        vegetationSignals,
        weatherSignals,
        signalCompleteness,
    };
}
/**
 * Calculate signal completeness percentage
 * Based on expected observation frequency within time window
 */
function calculateSignalCompleteness(windowStart, windowEnd, vegetationCount, weatherCount) {
    const start = new Date(windowStart);
    const end = new Date(windowEnd);
    const daysInWindow = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    // Expected frequencies:
    // - Satellite imagery: every 5 days
    // - Weather observations: daily
    const expectedVegetation = Math.ceil(daysInWindow / 5);
    const expectedWeather = daysInWindow;
    const totalExpected = expectedVegetation + expectedWeather;
    const totalActual = vegetationCount + weatherCount;
    if (totalExpected === 0)
        return 0;
    const completeness = (totalActual / totalExpected) * 100;
    return Math.min(100, Math.round(completeness));
}
