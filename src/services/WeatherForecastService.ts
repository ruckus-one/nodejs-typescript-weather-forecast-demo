import { injectable, inject } from "inversify"
import OpenWeatherDummyAdapter from "../adapters/OpenWeatherDummyAdapter"
import VisualCrossingDummyAdapter from "../adapters/VisualCrossingDummyAdapter"
import WeatherApiDummyAdapter from "../adapters/WeatherApiDummyAdapter"
import WeatherDataAdapter from "../interfaces/WeatherDataAdapter"
import WeatherForecast from "../interfaces/WeatherForecast"
import WeatherSummaryData from "../interfaces/WeatherSummaryData"
import WeatherDataFormatService from "./WeatherDataFormatService"
import StringDictionary from "../types/StringDictionary"
import TYPES from "../types"
import WeatherApiAdapter from "../adapters/WeatherApiAdapter"
import VisualCrossingAdapter from "../adapters/VisualCrossingAdapter"
import OpenWeatherAdapter from "../adapters/OpenWeatherAdapter"
import Coordinates from "../types/Coordinates"

@injectable()
export default class WeatherForecastService implements WeatherForecast {
    adapter: WeatherDataAdapter
    providers: Map<string, WeatherDataAdapter>
    formatter: WeatherDataFormatService

    public constructor(@inject(TYPES.WeatherDataFormatter) formatter: WeatherDataFormatService) {
        this.formatter = formatter
        
        this.providers = new Map<string, WeatherDataAdapter>()
        this.providers.set('open-weather-dummy', new OpenWeatherDummyAdapter())
        this.providers.set('weather-api-dummy', new WeatherApiDummyAdapter())
        this.providers.set('visual-crossing-dummy', new VisualCrossingDummyAdapter())
        this.providers.set('open-weather', new OpenWeatherAdapter())
        this.providers.set('weather-api', new WeatherApiAdapter())
        this.providers.set('visual-crossing', new VisualCrossingAdapter())
    }

    public setProvider(provider: string): void {
        if (this.providers.has(provider)) {
            this.adapter = this.providers.get(provider)
        } else {
            this.adapter = null
        }
    }

    public listProviders(): Array<string> {
        let result = []
        for (let provider of this.providers.keys()) {
            result.push(provider)
        }

        return result
    }

    public async getDailyAtLocation(coords: Coordinates): Promise<StringDictionary> {
        if (this.adapter === null) {
            throw new Error('ERR_INVALID_PROVIDER')
        }
        if (coords.lat === null || coords.lng === null) {
            throw new Error('ERR_LOCATION_NOT_SPECIFIED')
        }
        const data : WeatherSummaryData[] = await this.adapter.getWeatherData(coords)

        let weatherSummary: StringDictionary = {}

        for (let i=0; i<data.length; i++) {
            const description = this.formatter.stringifyDailyWeather(data[i])
            const key = this.formatter.formatTimestamp(data[i].timestamp)

            weatherSummary[key] = description
        }

        return Promise.resolve(weatherSummary)
    }
}