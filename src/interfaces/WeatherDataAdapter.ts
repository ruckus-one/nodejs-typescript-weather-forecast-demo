import Coordinates from "../types/Coordinates";
import WeatherSummaryData from "./WeatherSummaryData";

export default interface WeatherDataAdapter {
    getWeatherData(coords: Coordinates): Promise<Array<WeatherSummaryData>>
}