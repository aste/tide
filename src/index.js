import './styles.css'
import { getDay, addHours, format } from 'date-fns'

async function getForecast(location) {
    let weatherData

    try {
        const apiKey = 'b850ee2d91154e8b913155353232806'
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`, { mode: 'cors' })

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





    function createHourlyForecastElements(currentHour) {
        const parentElement = document.getElementById('hourlyForecast')


        for (let i = 0; i < 24; i++) {
            let forecastHour
            if (i === 0) {
                forecastHour = 'Now'
            } else {
                forecastHour = format(addHours(currentHour, i), 'ha')
            }
            console.log(forecastHour)
            console.log(weatherData.forecast.forecastday[0].hour[i].condition.icon)
            console.log(`${Math.round(weatherData.forecast.forecastday[0].hour[i].temp_c)}°`)
            console.log('')

            //             <div class="weather-info">
            //     <img src="path-to-icon.png" alt="Weather Icon" class="weather-icon" />
            //     <span class="temperature">72°F</span>
            //     <time class="time">9 AM</time>
            // </div>
        }
        // create the elements with the data inside
        // append the element to the parent, continue until all hours are made
    }

    const currentHour = new Date(weatherData.forecast.forecastday[0].date)
    createHourlyForecastElements(currentHour)

    function generate3DayForecast() {
        const parentElement = document.getElementById('weeklyForecast')

        for (let i = 0; i < 3; i++) {
            let day
            if (i === 0) {
                day = "Today"
            } else {
                day = allWeekdays[getDay(new Date(weatherData.forecast.forecastday[i].date))]
            }
            console.log(day)
            console.log(weatherData.forecast.forecastday[i].day.condition.icon)
            console.log(Math.round(weatherData.forecast.forecastday[i].day.maxtemp_c))
            console.log(Math.round(weatherData.forecast.forecastday[i].day.mintemp_c))
            console.log('')
        }

        // create the elements with the data inside
        // append the element to the parent, continue until all days are made
    }

    generate3DayForecast()


}

const allWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

getForecast('copenhagen')