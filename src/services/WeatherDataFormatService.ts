import { injectable } from "inversify"
import * as moment from "moment"
import WeatherDataFormatter from "../interfaces/WeatherDataFormatter"
import WeatherSummaryData from "../interfaces/WeatherSummaryData"

@injectable()
export default class WeatherDataFormatService implements WeatherDataFormatter {
    stringifyDailyWeather(dayData: WeatherSummaryData): string {
        let description = new Array<string>()

        if (dayData.avgTemperature !== null) {
            let avgTemperature = Number(dayData.avgTemperature.toFixed(1))
            description.push(`avg. temperature of ${avgTemperature} °C`)
        }

        if (dayData.pressure !== null) {
            description.push(`pressure around ${dayData.pressure} hPa`)
        }

        if (dayData.humidity !== null) {
            description.push(`humidity around ${dayData.humidity}%`)
        }

        if (dayData.precipitation !== null) {
            description.push(`precipitation of ${dayData.precipitation} mm`)
        }

        if (dayData.description !== null) {
            description.push(dayData.description)
        }

        if (description.length === 0) {
            return 'the weather could not be described with words'
        }

        return description.join(', ')
    }

    formatTimestamp(timestamp: number): string {
        if (timestamp === null) {
            return "unknown"
        }

        return moment.unix(timestamp).format('DD-MM-YYYY')
    }
}