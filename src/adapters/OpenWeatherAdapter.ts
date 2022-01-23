import WeatherDataAdapter from '../interfaces/WeatherDataAdapter'
import WeatherSummaryData from '../interfaces/WeatherSummaryData'
import UtilsService from '../services/UtilsService'
import axios, { AxiosRequestConfig } from 'axios'
import Coordinates from '../types/Coordinates'

export default class OpenWeatherAdapter implements WeatherDataAdapter {
    options : AxiosRequestConfig<any>

    public constructor() {

        if (process.env.NODE_ENV !== 'test' &&
            process.env.OPEN_WEATHER_ADAPTER_HOST === undefined ||
            process.env.OPEN_WEATHER_ADAPTER_KEY === undefined) {
                throw new Error('ERR_MISSING_CONFIG')
            }

        this.options = {
            method: 'GET',
            url: `https://${process.env.OPEN_WEATHER_ADAPTER_HOST}/forecast/daily`,
            params: {
              q: 'san francisco,us',
              lat: '35',
              lon: '139',
              cnt: '16',
              units: 'metric',
            },
            headers: {
              'x-rapidapi-host': process.env.OPEN_WEATHER_ADAPTER_HOST,
              'x-rapidapi-key': process.env.OPEN_WEATHER_ADAPTER_KEY,
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

        data = data['data']['list']

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