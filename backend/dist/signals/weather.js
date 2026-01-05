/**
 * Weather Signal Processing
 * Pure functions for converting raw weather data into weather signals
 */
/**
 * Convert raw weather data into a WeatherSignal
 * Pure function - deterministic and side-effect free
 */
export function toWeatherSignal(rawWeatherData) {
    return {
        fieldId: rawWeatherData.fieldId,
        timestamp: rawWeatherData.timestamp,
        rainfall: rawWeatherData.current.precipitation,
        temperature: rawWeatherData.current.temperature,
        dataQuality: rawWeatherData.metadata?.dataQuality ?? 'medium',
    };
}
