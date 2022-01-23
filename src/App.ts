import * as express from "express"
import { Request, Response } from "express"
import "reflect-metadata"
import "dotenv/config"
import container from "./inversify.config"
import TYPES from "./types"
import WeatherForecast from "./interfaces/WeatherForecast"
import Places from "./interfaces/Places"
import UtilsService from "./services/UtilsService"

class App {
    public server

    constructor () {
        this.server = express()
        this.server.use(express.json())

        this.setup()
    }

    private setup (): void {
        const router = express.Router()

        router.get('/weather-forecast/:provider/:lat/:lng', async (req: Request, res: Response) => {

            const { provider, lat, lng } = req.params

            try {
                const service = container.get<WeatherForecast>(TYPES.WeatherForecast)
                service.setProvider(provider)

                const data = await service.getDailyAtLocation({ lat: Number(lat), lng: Number(lng) })
                res.status(200).send({ data, detail: `Daily weather summary for a given location (lat=${lat}, lng=${lng})` })
            } catch (error) {
                res.status(500).send({ error: error.message })
            }
        })

        router.get('/weather-forecast/providers', async (req: Request, res: Response) => {
            try {
                const service = container.get<WeatherForecast>(TYPES.WeatherForecast)
                const data = service.listProviders()
                res.status(200).send({ data, detail: 'List of available weather data providers' })
            } catch (error) {
                res.status(500).send({ error: error.message })
            }
        })

        router.get('/places', (req: Request, res: Response) => {
            const service = container.get<Places>(TYPES.Places)
            const { page, limit, query } = req.query

            let provider = req.query.provider
            if (provider === undefined) {
                if (process.env.DEFAULT_ADAPTER !== undefined) {
                    provider = process.env.DEFAULT_ADAPTER
                }
            }

            let data = []

            try {
                if (query === undefined) {
                    data = service.listCities(Number(page), Number(limit))
                } else {
                    data = service.search(query as string)
                }

                data = data.map(( city ) => {
                    city['forecast_url'] = UtilsService.generateForecastUrl({ protocol: req.protocol, host: req.get('host') }, (provider as string), { lat: city['lat'], lng: city['lng'] })
                    return city
                })

                res.status(200).send({ data, detail: 'List of browsable cities with corresponding coordinates, decoreated with a forecast url' })
            } catch (error) {
                res.status(500).send({ error: error.message })
            }
        })

        this.server.use('/', router)
    }
}

export default new App().server