import "./styles.css";
import { fromUnixTime, addHours, format } from "date-fns";

const SunCalc = require('suncalc');
const locationForm = document.getElementById("locationForm")

let location = "Tijuana"


async function getForecast(location) {
  let weatherData;

  try {
    const apiKey = "b850ee2d91154e8b913155353232806";
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`

    const response = await fetch(apiUrl);

    weatherData = await response.json();

    if (!response.ok) {
      if (response.status === "404") {
        return false
      }
      throw new Error(`HTTP error! Status: ${response.status}`),
      { mode: "cors" }
    }

    console.log(weatherData)

    setBackgroundSkyGradient(weatherData)

    setCurrentConditions(weatherData)

    // setHourlyForecast(weatherData)


    return true

  } catch (error) {
    console.error("There was a problem fetching the weather data", error);
    return false;
  }

}

function getCurrentLocalHour() {

}

function setCurrentConditions(weatherData) {
  const cityName = weatherData.location.name;
  const countryName = weatherData.location.country;
  const currentConditionText = convertToTitleCase(String(weatherData.current.condition.text));
  const currentTempC = Math.round(weatherData.current.temp_c);
  const todaysMaxTempC = Math.round(weatherData.forecast.forecastday[0].day.maxtemp_c);
  const todaysMinTempC = Math.round(weatherData.forecast.forecastday[0].day.mintemp_c);

  document.getElementById("locationName").innerHTML = cityName;
  document.getElementById("country").innerHTML = `${countryName}`;
  document.getElementById("currentTemp").innerHTML = `${currentTempC}°`;
  document.getElementById("currentConditionShort").innerHTML = currentConditionText;
  document.getElementById("todaysMaxTemp").innerHTML = `H:${todaysMaxTempC}°`;
  document.getElementById("todaysMinTemp").innerHTML = `L:${todaysMinTempC}°`;
}

function setHourlyForecast(weatherData) {
  console.log(weatherData)
  const parentElement = document.getElementById("hourlyForecast");

  for (let i = 0; i < 24; i++) {
    let forecastHour;
    if (i === 0) {
      forecastHour = "Now";
    } else {
      forecastHour = format(addHours(currentHour, i), "ha");
    }
    const currentLocalTime = format(new Date(weatherData.location.localtime), "H:mm aaaaa'm'")
    document.getElementById("currentLocalTime").innerHTML = `${currentLocalTime}`;
  }
}



function setThreeDayForecast(weatherData) {
  const parentElement = document.getElementById("weeklyForecast");

  for (let i = 0; i < 3; i++) {
    let day;
    if (i === 0) {
      day = "Today";
    } else {
      day = allWeekdays[getDay(new Date(weatherData.forecast.forecastday[i].date))];
    }
    console.log(day);
    console.log(weatherData.forecast.forecastday[i].day.condition.icon);
    console.log(Math.round(weatherData.forecast.forecastday[i].day.maxtemp_c));
    console.log(Math.round(weatherData.forecast.forecastday[i].day.mintemp_c));
    console.log("");
  }

}

function setBackgroundSkyGradient(weatherData) {
  const lat = weatherData.location.lat
  const lon = weatherData.location.lon
  const currentTime = new Date()
  const sunTimes = SunCalc.getTimes(currentTime, lat, lon);
  const cloudCover = weatherData.current.cloud
  const cloudOpacity = cloudCover / 100

  let skyGradient
  let cloudGradient

  if (currentTime > sunTimes.sunrise && currentTime < sunTimes.sunset) {
    skyGradient = "linear-gradient(to top, #89CFF0, #3ca0ff 50%, #3ca0ff)";
    cloudGradient = `linear-gradient(to top, rgba(0, 0, 0, 0), rgba(255, 255, 255, ${cloudOpacity * 0.75}) 50%, rgba(255, 255, 255, ${cloudOpacity * 1.5}) 95% )`
  } else if (currentTime > sunTimes.dawn && currentTime < sunTimes.dusk) {
    skyGradient = "linear-gradient(to top, #ffb100, #89CFF0 30%)";
    cloudGradient = `linear-gradient(to top, rgba(0, 0, 0, 0),  rgba(255, 255, 255, ${cloudOpacity}))`
  } else {
    skyGradient = "linear-gradient(to top, #0c0c3c, #000000 50%, #000000)";
    cloudGradient = `linear-gradient(to top, rgba(0, 0, 0, 0), rgba(255, 255, 255, ${cloudOpacity * 0.35}) 50%, rgba(255, 255, 255, ${cloudOpacity * 0.75}) 100% )`
  }

  document.body.style.backgroundImage = `${cloudGradient}, ${skyGradient}`;
}


function convertToTitleCase(str) {
  let splitStr = str.toLowerCase().split(' ')
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ')
}

locationForm.addEventListener('submit', function (e) {
  e.preventDefault()

  let location = document.getElementById('inputLocation').value

  if (location) {
    getForecast(location).then(isValid => {
      if (!isValid) {
        alert(`${location} is not a valid location, please enter a valid location.`)
      }
    })
  } else {
    alert(`Please enter a location.`)
  }

  document.getElementById('inputLocation').value = ''
})

getForecast(`${location}`);