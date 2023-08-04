// const dateFns = require('date-fns');

async function getForecast(location) {
    const weatherServerResponse = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=b850ee2d91154e8b913155353232806&q=${location}`,
        { mode: "cors" }
    )
    // const weatherData = await weatherServerResponse
    const weatherData = await weatherServerResponse.json()
    console.log(weatherData)

    let todaysMaxTempC = Math.round(weatherData.forecast.forecastday[0].day.maxtemp_c)
    let todaysMinTempC = Math.round(weatherData.forecast.forecastday[0].day.mintemp_c)

    document.getElementById('cityName').innerHTML = weatherData.location.name
    document.getElementById('country').innerHTML = weatherData.location.country
    document.getElementById('currentConditionShort').innerHTML = weatherData.current.condition.text
    document.getElementById('todaysMaxTemp').innerHTML = `H:${todaysMaxTempC}°`
    document.getElementById('todaysMinTemp').innerHTML = `L:${todaysMinTempC}°`
    document.getElementById('currentTemp').innerHTML = `${weatherData.current.temp_c}°`
}



getForecast('copenhagen')