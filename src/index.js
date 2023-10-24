import "./styles.css";
import { addHours, format } from "date-fns";

const SunCalc = require('suncalc');
const locationForm = document.getElementById("locationForm")

let location = "tokyo"
let lat
let lon

async function getForecast(location) {
  let weatherData;

  try {
    const apiKey = "b850ee2d91154e8b913155353232806";
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`
    );

    weatherData = await response.json();

    if (!response.ok) {
      if (response.status === "404") {
        return false
      }
      throw new Error(`HTTP error! Status: ${response.status}`),
      { mode: "cors" }
    }

    // const currentHour = new Date(weatherData.forecast.forecastday[0].date);
    let cityName = weatherData.location.name;
    let countryName = weatherData.location.country;
    lat = weatherData.location.lat
    lon = weatherData.location.lon
    // currentTime = weatherData.current.last_updated_epoch


    let currentConditionText = convertToTitleCase(String(weatherData.current.condition.text));
    let currentConditionIcon = weatherData.current.condition.icon;
    let currentTempC = Math.round(weatherData.current.temp_c);
    let currentPercipMm = weatherData.current.percip_mm;
    let currentWindKph = weatherData.current.wind_kph;
    let currentWindDirection = weatherData.current.wind_degree;
    let currentHumidity = weatherData.current.humidity;
    let currentUvIndex = weatherData.current.uv;
    let currentTimeEpoc = weatherData.current.time_epoch;
    let todaysSunriseTime = weatherData.forecast.forecastday[0].astro.sunrise;
    let todaysSunsetTime = weatherData.forecast.forecastday[0].astro.sunset;
    let todaysChanceOfRain = weatherData.forecast.forecastday[0].day.daily_chance_of_rain;
    let todaysMaxTempC = Math.round(weatherData.forecast.forecastday[0].day.maxtemp_c);
    let todaysMinTempC = Math.round(weatherData.forecast.forecastday[0].day.mintemp_c);

    document.getElementById("locationName").innerHTML = cityName;
    document.getElementById("country").innerHTML = countryName;
    document.getElementById("currentConditionShort").innerHTML = currentConditionText;
    // document.getElementById('currentConditionIcon').src = currentConditionIcon
    document.getElementById("todaysMaxTemp").innerHTML = `H:${todaysMaxTempC}°`;
    document.getElementById("todaysMinTemp").innerHTML = `L:${todaysMinTempC}°`;
    document.getElementById("currentTemp").innerHTML = `${currentTempC}°`;

    setSkyGradient()
    return true

  } catch (error) {
    console.error("There was a problem fetching the weather data", error);
    return false;
  }

  // getHourlyForecast(currentHour);

  console.log(weatherData);
  // get3DayForecast();
}

function convertToTitleCase(str) {
  let splitStr = str.toLowerCase().split(' ')
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ')
}

function getHourlyForecast(currentHour) {
  const parentElement = document.getElementById("hourlyForecast");

  for (let i = 0; i < 24; i++) {
    let forecastHour;
    if (i === 0) {
      forecastHour = "Now";
    } else {
      forecastHour = format(addHours(currentHour, i), "ha");
    }
    // console.log(forecastHour);
    // console.log(weatherData.forecast.forecastday[0].hour[i].condition.icon);
    // console.log(`${Math.round(weatherData.forecast.forecastday[0].hour[i].temp_c)}°`);
    // console.log("");

    //<div class="weather-info">
    //<img src="path-to-icon.png" alt="Weather Icon" class="weather-icon" />
    //<span class="temperature">72°F</span>
    //<time class="time">9 AM</time>
    // </div>
  }
  // create the elements with the data inside
  // append the element to the parent, continue until all hours are made
}

function get3DayForecast() {
  const parentElement = document.getElementById("weeklyForecast");

  for (let i = 0; i < 3; i++) {
    let day;
    if (i === 0) {
      day = "Today";
    } else {
      // day = allWeekdays[getDay(new Date(weatherData.forecast.forecastday[i].date))];
    }
    console.log(day);
    console.log(weatherData.forecast.forecastday[i].day.condition.icon);
    console.log(Math.round(weatherData.forecast.forecastday[i].day.maxtemp_c));
    console.log(Math.round(weatherData.forecast.forecastday[i].day.mintemp_c));
    console.log("");
  }

  // create the elements with the data inside
  // append the element to the parent, continue until all days are made
}

function setSkyGradient() {
  const currentTime = new Date()
  const sunTimes = SunCalc.getTimes(currentTime, lat, lon);

  let gradient;

  if (currentTime > sunTimes.sunrise && currentTime < sunTimes.sunset) {
    gradient = "linear-gradient(to top, #89CFF0, #3ca0ff)"; // Daytime
  } else if (currentTime > sunTimes.dawn && currentTime < sunTimes.dusk) {
    gradient = "linear-gradient(to top, #ffb100, #89CFF0)"; // Sunrise/Sunset
  } else {
    gradient = "linear-gradient(to top, #0c0c3c, #000000)"; // Nighttime
  }

  document.body.style.backgroundImage = `${gradient}`;
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