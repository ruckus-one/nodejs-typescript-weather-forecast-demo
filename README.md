# Introduction

This is a demo project to combine NodeJS/Express & TypeScript, creating a simple weather forecast themed API. Other tech used is: Inversify, Axios, Jest & Babel, MomentJS.

Thanks to https://github.com/lutangar/cities.json for giving me a nice list of actual cities to play around with.

## Configuration

Run `npm install` upon cloning the repo.

See `.env.example` for details on what's required before running the application. (generate your own `.env` file accordingly)

## Available commands
`npm run test` runs test suites using Jest (+ babel for typescript)
`npm run compile` compiles the app using **tsc** into the ./dist folder
`npm run dev` spins up a node dev server to test the API locally (likely to be 127.0.0.1:3000)

## Architecture summary

Due to the fact that this demo app requires various, sometimes different weather APIs, a multitude of adapters were created to translate each source of data into a common **WeatherSummaryData** interface. A map of available adapters allows to select the desired adapter with a simple string **key**.

Upon successful data retrieval (see config section) the weather details is then formatted into a summary string and set against it's date representation, which are serving as the result array's keys.

It's an Express app so each route should result in either error or a result of 1 or more service calls.

Extending the application with new providers should be as easy as:
- Creating a new adapter class specific to the data source
- Registering it in the **WeatherForecastService**.

Usage of Inversify and the services patterns allows easy adaptation of the microservices architecture if required (beyond this demo).

To accomodate Jest unit testing with Typescript some babel plugins & presets were used.

## RESTful API summary
### List places
- `GET /places `
*returns a list of popular cities around the world, together with the gps coordinates and internal weather forecast URL*
**Examples**
- `/places?query=Warsaw ' - search for a particular place
- `/places?page=3&limit=20 ' - browse the list

**Example response**
`{"data":[{"country":"AT","name":"Ybbs an der Donau","lat":"48.16667","lng":"15.08333","forecast_url":"http://127.0.0.1:3000/weather-forecast/open-weather-dummy/48.16667/15.08333"}]}`

### List data providers
- `GET /weather-forecast/providers `
*returns a list of currently supported weather data APIs*
**Example response**
- `{"data":["open-weather-dummy","weather-api-dummy","visual-crossing-dummy","open-weather","weather-api","visual-crossing"],"detail":"List of available weather data providers"}`

### Get weather forecast for location
`GET /weather-forecast/:provider/:lat/:lng`
params:
- pick a **provider** key from the /weather-forecast/providers endpoint
- insert existing **lat/lng** pair or see the **forecast_url** field from the /places endpoint

*return an associative array containing a sequence of upocming dates together with a short summary of the forecast (currently 16 days forward)*
**Example response**
` {"data":{"20-01-2022":"avg. temperature of 12.8 °C, pressure around 1027 hPa, humidity around 77%, broken clouds","21-01-2022":"avg. temperature of 14.1 °C, pressure around 1021 hPa, humidity around 44%, broken clouds","22-01-2022":"avg. temperature of 12.6 °C, pressure around 1020 hPa, humidity around 41%, sky is clear","23-01-2022":"avg. temperature of 12 °C, pressure around 1021 hPa, humidity around 48%, scattered clouds","24-01-2022":"avg. temperature of 11.3 °C, pressure around 1017 hPa, humidity around 56%, few clouds","25-01-2022":"avg. temperature of 11.9 °C, pressure around 1017 hPa, humidity around 45%, scattered clouds","26-01-2022":"avg. temperature of 12.1 °C, pressure around 1023 hPa, humidity around 49%, sky is clear","27-01-2022":"avg. temperature of 12.2 °C, pressure around 1026 hPa, humidity around 52%, sky is clear","28-01-2022":"avg. temperature of 11.4 °C, pressure around 1025 hPa, humidity around 55%, overcast clouds","29-01-2022":"avg. temperature of 11.1 °C, pressure around 1020 hPa, humidity around 59%, sky is clear","30-01-2022":"avg. temperature of 11 °C, pressure around 1016 hPa, humidity around 62%, sky is clear","31-01-2022":"avg. temperature of 10.6 °C, pressure around 1015 hPa, humidity around 42%, sky is clear","01-02-2022":"avg. temperature of 10.1 °C, pressure around 1014 hPa, humidity around 52%, few clouds","02-02-2022":"avg. temperature of 9.6 °C, pressure around 1020 hPa, humidity around 40%, sky is clear","03-02-2022":"avg. temperature of 10.2 °C, pressure around 1017 hPa, humidity around 63%, broken clouds","04-02-2022":"avg. temperature of 10.7 °C, pressure around 1016 hPa, humidity around 36%, sky is clear"},"detail":"Daily weather summary for a given location (lat=48.40163, lng=15.58102)"} `