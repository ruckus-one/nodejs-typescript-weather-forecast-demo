import Coordinates from "../types/Coordinates";
import StringDictionary from "../types/StringDictionary";

export default interface WeatherForecast {
    setProvider(provider: string): void
    listProviders(): string[]
    getDailyAtLocation(coords: Coordinates): Promise<StringDictionary>
}