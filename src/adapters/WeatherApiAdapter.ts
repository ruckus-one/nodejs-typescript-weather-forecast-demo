import WeatherDataAdapter from '../interfaces/WeatherDataAdapter'
import WeatherSummaryData from '../interfaces/WeatherSummaryData'
import UtilsService from '../services/UtilsService'
import axios, { AxiosRequestConfig } from 'axios'
import Coordinates from '../types/Coordinates'

export default class WeatherApiAdapter implements WeatherDataAdapter {
    options : AxiosRequestConfig<any>

    public constructor() {

        if (process.env.NODE_ENV !== 'test' &&
            process.env.WEATHER_API_ADAPTER_HOST === undefined ||
            process.env.WEATHER_API_ADAPTER_KEY === undefined) {
                throw new Error('ERR_MISSING_CONFIG')
            }

        this.options = {
            method: 'GET',
            url: `https://${process.env.WEATHER_API_ADAPTER_HOST}/forecast/daily`,
            params: {
                lat: '38.5',
                lon: '-78.5',
            },
            headers: {
              'x-rapidapi-host': process.env.WEATHER_API_ADAPTER_HOST,
              'x-rapidapi-key': process.env.WEATHER_API_ADAPTER_KEY,
            },
        }
    }

    async getWeatherData(coords: Coordinates): Promise<WeatherSummaryData[]> {

        this.options.params.lat = coords.lat
        this.options.params.lon = coords.lng

        let data = null
        try {
            data = await axios.request(this.options)
        } catch (error) {
            return Promise.reject([])
        }

        data = data['data']['data']

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