import "reflect-metadata"
import WeatherDataFormatService from "../src/services/WeatherDataFormatService"
import WeatherForecastService from '../src/services/WeatherForecastService'

describe('weather forecast service', () => {
    test('throws an error when no valid provider is used', async () => {
        const subject = new WeatherForecastService(new WeatherDataFormatService())
        subject.setProvider('non-existing-provider')

        try {
            await subject.getDailyAtLocation({ lat: 0, lng: 0 })
        } catch (error) {
            expect(error.message).toBe('ERR_INVALID_PROVIDER')
        }
    })

    test('generates a description for a day when using a realistic adapter', async () => {
        const subject = new WeatherForecastService(new WeatherDataFormatService())

        subject.setProvider('weather-api-dummy')
        const result = await subject.getDailyAtLocation.call(subject, { lat: 0, lng: 0 })

        expect(result['21-01-2022']).not.toBe(undefined)
        expect(result['imaginary-day']).toBe(undefined)
        expect(result['25-01-2022']).toBe("avg. temperature of -1.4 °C, pressure around 1020 hPa, precipitation of 2.1875 mm, Mix snow/rain")
    })
})