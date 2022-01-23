import WeatherSummaryData from "./WeatherSummaryData";

export default interface WeatherDataFormatter {
    stringifyDailyWeather(dayData: WeatherSummaryData): string
    formatTimestamp(timestamp: number): string
}