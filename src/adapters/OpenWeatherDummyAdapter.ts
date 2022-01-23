import WeatherDataAdapter from '../interfaces/WeatherDataAdapter'
import * as fs from 'fs'
import * as path from 'path'
import WeatherSummaryData from '../interfaces/WeatherSummaryData'
import UtilsService from '../services/UtilsService'
import Coordinates from '../types/Coordinates'

export default class OpenWeatherDummyAdapter implements WeatherDataAdapter {
    getWeatherData(coords: Coordinates): Promise<WeatherSummaryData[]> {
        const content = fs.readFileSync(path.join(__dirname, '../../test/dummy-data/open-weather-dummy.json'))
        let data = JSON.parse(content.toString())
        data = data['list']

        const array = new Array<WeatherSummaryData>()
        for (let i=0; i<data.length; i++) {
            const dayData = data[i]

            const item : WeatherSummaryData = {
                avgTemperature: null,
                pressure: null,
                humidity: null,
                precipitation: null,
                description: null,
                timestamp: null
            }

            if (dayData.hasOwnProperty('temp') && typeof dayData['temp'] === 'object') {
                const avg = UtilsService.avg(Object.values(dayData['temp']))
                item.avgTemperature = avg
            }

            if (dayData.hasOwnProperty('pressure') && typeof dayData['pressure'] === 'number') {
                item.pressure = dayData['pressure']
            }

            if (dayData.hasOwnProperty('humidity') && typeof dayData['humidity'] === 'number') {
                item.humidity = dayData['humidity']
            }

            if (dayData.hasOwnProperty('weather') && typeof dayData['weather'] === 'object') {
                if (dayData['weather'].length && dayData['weather'][0].hasOwnProperty('description')) {
                    item.description = dayData['weather'][0]['description']
                }
            }

            if (dayData.hasOwnProperty('dt') && typeof dayData['dt'] === 'number') {
                item.timestamp = dayData['dt']
            }

            array.push(item)
        }

        return Promise.resolve(array)
    }
}