import WeatherDataAdapter from '../interfaces/WeatherDataAdapter'
import * as fs from 'fs'
import * as path from 'path'
import WeatherSummaryData from '../interfaces/WeatherSummaryData'
import Coordinates from '../types/Coordinates'

export default class VisualCrossingDummyAdapter implements WeatherDataAdapter {
    getWeatherData(coords: Coordinates): Promise<Array<WeatherSummaryData>> {
        const content = fs.readFileSync(path.join(__dirname, '../../test/dummy-data/visual-crossing-dummy.json'))
        let data = JSON.parse(content.toString())
        data = data['locations']
        const keys = Object.keys(data)
        data =  data[keys[0]]['values']

        let array = new Array<WeatherSummaryData>()
        for (let i=0; i<data.length; i++) {
            const dayData = data[i]

            let item : WeatherSummaryData = {
                avgTemperature: null,
                pressure: null,
                humidity: null,
                precipitation: null,
                description: null,
                timestamp: null
            }

            if (dayData.hasOwnProperty('temp') && typeof dayData['temp'] === 'number') {
                item.avgTemperature = dayData['temp']
            }
    
            if (dayData.hasOwnProperty('sealevelpressure') && typeof dayData['sealevelpressure'] === 'number') {
                item.pressure = dayData['sealevelpressure']
            }
    
            if (dayData.hasOwnProperty('precip') && typeof dayData['precip'] === 'number') {
                item.precipitation = dayData['precip']
            }
    
            if (dayData.hasOwnProperty('humidity') && typeof dayData['humidity'] === 'number') {
                item.humidity = dayData['humidity']
            }
    
            if (dayData.hasOwnProperty('conditions') && typeof dayData['conditions'] === 'string') {
                item.description = dayData['conditions']
            }

            if (dayData.hasOwnProperty('datetime') && typeof dayData['datetime'] === 'number') {
                item.timestamp = dayData['datetime'] / 1000
            }

            array.push(item)
        }

        return Promise.resolve(array)
    }
}