import './styles.css'
import { format } from 'date-fns'

async function getForecast(location) {
    let weatherData

    try {
        const apiKey = 'b850ee2d91154e8b913155353232806'
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`, { mode: 'cors' })

        console.log(response)

        weatherData = await response.json()

        console.log(weatherData)
        let cityName = weatherData.location.name
        let countryName = weatherData.location.country

        let currentConditionText = weatherData.current.condition.text
        let currentConditionIcon = weatherData.current.condition.icon
        let currentTempC = Math.round(weatherData.current.temp_c)
        let currentPercipMm = weatherData.current.percip_mm
        let currentWindKph = weatherData.current.wind_kph
        let currentWindDirection = weatherData.current.wind_degree
        let currentHumidity = weatherData.current.humidity
        let currentUvIndex = weatherData.current.uv
        let currentTimeEpoc = weatherData.current.time_epoch

        let todaysSunriseTime = weatherData.forecast.forecastday[0].astro.sunrise
        let todaysSunsetTime = weatherData.forecast.forecastday[0].astro.sunset
        let todaysChanceOfRain = weatherData.forecast.forecastday[0].day.daily_chance_of_rain
        let todaysMaxTempC = Math.round(weatherData.forecast.forecastday[0].day.maxtemp_c)
        let todaysMinTempC = Math.round(weatherData.forecast.forecastday[0].day.mintemp_c)

        document.getElementById('cityName').innerHTML = cityName
        document.getElementById('country').innerHTML = countryName
        document.getElementById('currentConditionText').innerHTML = currentConditionText
        // document.getElementById('currentConditionIcon').innerHTML = currentConditionIcon
        document.getElementById('todaysMaxTemp').innerHTML = `H:${todaysMaxTempC}°`
        document.getElementById('todaysMinTemp').innerHTML = `L:${todaysMinTempC}°`
        document.getElementById('currentTemp').innerHTML = `${currentTempC}°`

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }



    } catch (error) {
        console.error("There was a problem fetching the weather data", error)
        return
    }





    function createHourlyForecastElements(currentTimeEpoc) {
        // reference the parent element
        // generate a for loop
        // get the necessary data from the the api for each hour using each hour of the day in the for loop
        // create the elements with the data inside
        // time, weather icon, temperature
        // append the element to the parent, continue until all hours are made
    }


    function generate3dayForecastElements(currentTimeEpoc) {
        // reference the parent element
        // generate a for loop
        // get the necessary data from the the api for each hour using each hour of the day in the for loop
        // create the elements with the data inside
        // time, weather icon, temperature
        // append the element to the parent, continue until all hours are made
    }



}


getForecast('copenhagen')