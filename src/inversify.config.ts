import { Container } from "inversify"
import TYPES from "./types"
import WeatherForecast from "./interfaces/WeatherForecast"
import WeatherForecastService from "./services/WeatherForecastService"
import WeatherDataFormatService from "./services/WeatherDataFormatService"
import WeatherDataFormatter from "./interfaces/WeatherDataFormatter"
import PlacesService from "./services/PlacesService"
import Places from "./interfaces/Places"

var container = new Container()
container.bind<WeatherForecast>(TYPES.WeatherForecast).to(WeatherForecastService)
container.bind<WeatherDataFormatter>(TYPES.WeatherDataFormatter).to(WeatherDataFormatService)
container.bind<Places>(TYPES.Places).to(PlacesService)

export default container