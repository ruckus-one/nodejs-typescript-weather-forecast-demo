import UtilsService from "../src/services/UtilsService"

describe('utils: basic averaging', () => {
    test('calculates simple average', () => {
        let subject = UtilsService.avg([1,2,3])

        expect(subject).toBe(2)
    })
    test('is okay with decimal numbers', () => {
        let subject = UtilsService.avg([1.1, 2.2, 3.456])

        expect(subject).toBeCloseTo(2.252, 3)
    })
    test('is okay with negative numbers', () => {
        let subject = UtilsService.avg([-2, 0, -0, 4])

        expect(subject).toBe(0.5)
    })
    test('is handling dividing by zero', () => {
        let subject = UtilsService.avg([])

        expect(subject).toBe(0)
    })

    test('generates a full forecast url', () => {
        const protocol = 'https'
        const host = 'example.com'

        let subject = UtilsService.generateForecastUrl({ host, protocol }, 'dummy-provider', { lat: 1, lng: 2 })

        expect(subject).toBe('https://example.com/weather-forecast/dummy-provider/1/2')
    })
})