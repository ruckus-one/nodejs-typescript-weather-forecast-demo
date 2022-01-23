import "reflect-metadata"
import WeatherDataFormatService from "../src/services/WeatherDataFormatService"

describe('weather data formatter', () => {
    test('generates a string description from complete weather data', () => {
        const subject = new WeatherDataFormatService()
        const result = subject.stringifyDailyWeather({
            avgTemperature: 10,
            pressure: 1000,
            humidity: 50,
            precipitation: 100,
            description: 'shite weather',
            timestamp: 123,
        })

        expect(result).toBe("avg. temperature of 10 °C, pressure around 1000 hPa, humidity around 50%, precipitation of 100 mm, shite weather")
    })
    test('generates a partial string description from incomplete weather data', () => {
        const subject = new WeatherDataFormatService()
        const result = subject.stringifyDailyWeather({
            avgTemperature: null,
            pressure: null,
            humidity: 50,
            precipitation: null,
            description: 'amazing weather',
            timestamp: 456,
        })

        expect(result).toBe("humidity around 50%, amazing weather")
    })
    test('generates a default message when no weather data available', () => {
        const subject = new WeatherDataFormatService()
        const result = subject.stringifyDailyWeather({
            avgTemperature: null,
            pressure: null,
            humidity: null,
            precipitation: null,
            description: null,
            timestamp: null,
        })

        expect(result).toBe("the weather could not be described with words")
    })

    test('formats timestamp as expected', () => {
        const subject = new WeatherDataFormatService()
        const result = subject.formatTimestamp(1642768688)
        expect(result).toBe("21-01-2022")
    })
    test('can format a weird timestamp withour an error', () => {
        const subject = new WeatherDataFormatService()
        const result = subject.formatTimestamp(-1642768688)
        expect(result).toBe("11-12-1917")
    })
    test('can handle an empty timestamp', () => {
        const subject = new WeatherDataFormatService()
        const result = subject.formatTimestamp(null)
        expect(result).toBe("unknown")
    })
})
