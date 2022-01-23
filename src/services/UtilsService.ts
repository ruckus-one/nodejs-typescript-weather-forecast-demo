import Coordinates from "../types/Coordinates"

export default class UtilsService {
    public static avg(numbers: number[]): number {
        if (numbers.length === 0) {
            return 0
        }

        return numbers.reduce((acc, n) => acc + n, 0) / numbers.length
    }

    public static generateForecastUrl(req: { protocol: string, host: string }, provider: string, coords: Coordinates): string {
        return `${req.protocol}://${req.host}/weather-forecast/${provider}/${coords.lat}/${coords.lng}`
    }
}