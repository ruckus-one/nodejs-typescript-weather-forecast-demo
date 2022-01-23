import WeatherDataAdapter from '../interfaces/WeatherDataAdapter'
import * as fs from 'fs'
import * as path from 'path'
import WeatherSummaryData from '../interfaces/WeatherSummaryData'
import UtilsService from '../services/UtilsService'
import Coordinates from '../types/Coordinates'

export default class WeatherApiDummyAdapter implements WeatherDataAdapter {
    getWeatherData(coords: Coordinates): Promise<WeatherSummaryData[]> {
        const content = fs.readFileSync(path.join(__dirname, '../../test/dummy-data/weather-api-dummy.json'))
        let data = JSON.parse(content.toString())
        data = data['data']

        const array = new Array<WeatherSummaryData>()
        for (let i=0; i<data.length; i++) {
            const dayData = data[i]

            const item : WeatherSummaryData = {
                avgTemperature: null,
                pressure: null,
                humidity: null,
                precipitation: null,
                description: null,
                timestamp: null,
            }

            if (dayData.hasOwnProperty('min_temp') && typeof dayData['min_temp'] === 'number' &&
                dayData.hasOwnProperty('max_temp') && typeof dayData['max_temp'] === 'number') {
                const avgTemperature = UtilsService.avg([dayData['min_temp'], dayData['max_temp']])

                item.avgTemperature = avgTemperature
            }

            if (dayData.hasOwnProperty('slp') && typeof dayData['slp'] === 'number') {
                item.pressure = dayData['slp']
            }

            if (dayData.hasOwnProperty('precip') && typeof dayData['precip'] === 'number') {
                item.precipitation = dayData['precip']
            }

            if (dayData.hasOwnProperty('weather') && typeof dayData['weather'] === 'object') {
                if (dayData['weather'].hasOwnProperty('description')) {
                    item.description = dayData['weather']['description']
                }
            }

            if (dayData.hasOwnProperty('ts') && typeof dayData['ts'] === 'number') {
                item.timestamp = dayData['ts']
            }

            array.push(item)
        }

        return Promise.resolve(array)
    }
}