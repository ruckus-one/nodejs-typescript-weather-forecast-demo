import WeatherDataAdapter from '../interfaces/WeatherDataAdapter'
import WeatherSummaryData from '../interfaces/WeatherSummaryData'
import axios, { AxiosRequestConfig } from 'axios'
import Coordinates from '../types/Coordinates'

export default class VisualCrossingAdapter implements WeatherDataAdapter {
    options : AxiosRequestConfig<any>

    public constructor() {

        if (process.env.NODE_ENV !== 'test' &&
            process.env.VISUAL_CROSSING_ADAPTER_HOST === undefined ||
            process.env.VISUAL_CROSSING_ADAPTER_KEY === undefined) {
                throw new Error('ERR_MISSING_CONFIG')
            }

        this.options = {
            method: 'GET',
            url: `https://${process.env.VISUAL_CROSSING_ADAPTER_HOST}/forecast`,
            params: {
                location: 'Washington,DC,USA',
                aggregateHours: '24',
                shortColumnNames: '0',
                unitGroup: 'us',
                contentType: 'json',
            },
            headers: {
                'x-rapidapi-host': process.env.VISUAL_CROSSING_ADAPTER_HOST,
                'x-rapidapi-key': process.env.VISUAL_CROSSING_ADAPTER_KEY,
            }
        }
    }

    async getWeatherData(coords: Coordinates): Promise<Array<WeatherSummaryData>> {

        this.options.params.location = `${coords.lng},${coords.lat}`

        let data = null
        try {
            data = await axios.request(this.options)
        } catch (error) {
            return Promise.reject([])
        }
        
        data = data['data']['locations']

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