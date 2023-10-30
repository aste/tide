import "./styles.css";
import { fromUnixTime, addHours, format, getHours } from "date-fns";

const SunCalc = require('suncalc');
const locationForm = document.getElementById("locationForm")

let location = "London"


async function getForecast(location) {
  let weatherData
  const apiKey = "b850ee2d91154e8b913155353232806";

  try {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`

    const response = await fetch(apiUrl);


    console.log(weatherData)
    if (!response.ok) {
      if (response.status === 404) {
        return false
      }
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    weatherData = await response.json();

    setBackgroundSkyGradient(weatherData)
    setCurrentConditions(weatherData)
    setHourlyForecast(weatherData)
    setThreeDayForecast(weatherData)

    return true

  } catch (error) {
    console.error("There was a problem fetching the weather data", error);
    return false;
  }
}

function setCurrentConditions(weatherData) {
  const cityName = weatherData.location.name;
  const countryName = weatherData.location.country;
  const currentConditionShortText = convertToTitleCase(String(weatherData.current.condition.text));
  const currentTempC = Math.round(weatherData.current.temp_c);
  const todaysMaxTempC = Math.round(weatherData.forecast.forecastday[0].day.maxtemp_c);
  const todaysMinTempC = Math.round(weatherData.forecast.forecastday[0].day.mintemp_c);

  document.getElementById("locationName").innerHTML = cityName;
  document.getElementById("country").innerHTML = `${countryName}`;
  document.getElementById("currentTemp").innerHTML = `${currentTempC}°`;
  document.getElementById("currentConditionShortText").innerHTML = currentConditionShortText;
  document.getElementById("todaysMaxTemp").innerHTML = `H:${todaysMaxTempC}°`;
  document.getElementById("todaysMinTemp").innerHTML = `L:${todaysMinTempC}°`;
}

function getCurrentLocalHour(weatherData) {
  const localTime = weatherData.location.localtime
  const hour = parseInt(localTime.split(' ')[1].split(':')[0], 10)
  return hour
}


function setHourlyForecast(weatherData) {
  const localHour = getCurrentLocalHour(weatherData)
  const day1 = weatherData.forecast.forecastday[0].hour
  const day2 = weatherData.forecast.forecastday[1].hour
  const hourlyArray = day1.concat(day2)
  const hourlySection = document.getElementById('hourlyForecastContainer')

  clearDomContainer(hourlySection)

  for (let i = localHour; i < localHour + 12; i++) {

    const hourlyArticle = document.createElement('article')
    hourlyArticle.classList.add("hour", `${i % 24}`)
    hourlySection.appendChild(hourlyArticle)

    const hourlyTime = document.createElement('h3')
    hourlyTime.classList.add("hourlyTime")
    if (i === localHour) {
      hourlyTime.textContent = "Now"
    } else {
      hourlyTime.textContent = `${i % 24}.00`
    }
    hourlyArticle.appendChild(hourlyTime)

    const hourlyWeatherIcon = document.createElement('img')
    hourlyWeatherIcon.classList.add('hourlyWeatherIcon')
    hourlyWeatherIcon.src = `${hourlyArray[i].condition.icon}`;
    hourlyWeatherIcon.alt = `Icon of todays weather: ${hourlyArray[i].condition.icon}`;
    hourlyArticle.appendChild(hourlyWeatherIcon)

    const hourlyTemp = document.createElement('h3')
    hourlyTemp.classList.add("hourlyTemp")
    hourlyTemp.textContent = `${Math.round(hourlyArray[i].temp_c)}°`
    hourlyArticle.appendChild(hourlyTemp)
    hourlySection.appendChild(hourlyArticle)
  }
}


function setThreeDayForecast(weatherData) {
  const dailyForecastArray = weatherData.forecast.forecastday;
  const dailySection = document.getElementById('dailyForecastContainer');

  clearDomContainer(dailySection);

  for (let i = 0; i < 3; i++) {
    const dailyForecast = dailyForecastArray[i];

    const dailyArticle = document.createElement('article');
    dailyArticle.classList.add("day", `${i}`);
    dailySection.appendChild(dailyArticle);

    const dayName = document.createElement('h3');
    dayName.classList.add("dayName");
    console.log(dayName)
    dayName.textContent = new Date(dailyForecast.date).toLocaleDateString('en-US', { weekday: "short" });
    dailyArticle.appendChild(dayName);

    const dailyIcon = document.createElement('img');
    dailyIcon.classList.add('dailyIcon');
    dailyIcon.src = dailyForecast.day.condition.icon;
    dailyIcon.alt = `Weather icon for the day: ${dailyForecast.day.condition.text}`;
    dailyArticle.appendChild(dailyIcon);

    const dailyTempSection = document.createElement('section')
    dailyTempSection.classList.add("minMaxTempContainer", "dailyMinMax");
    dailyArticle.appendChild(dailyTempSection)

    const dailyLowTemp = document.createElement('h3');
    dailyLowTemp.classList.add("dailyLowTemp");
    dailyLowTemp.textContent = `L:${Math.round(dailyForecast.day.mintemp_c)}°`;
    dailyTempSection.appendChild(dailyLowTemp);

    const dailyHighTemp = document.createElement('h3');
    dailyHighTemp.classList.add("dailyHighTemp");
    dailyHighTemp.textContent = `H:${Math.round(dailyForecast.day.maxtemp_c)}°`;
    dailyTempSection.appendChild(dailyHighTemp);

    const dailyRainChance = document.createElement('h3');
    dailyRainChance.classList.add("dailyRainChance");
    dailyRainChance.textContent = `Rain ${dailyForecast.day.daily_chance_of_rain}%`;
    dailyArticle.appendChild(dailyRainChance);



    dailySection.appendChild(dailyArticle);
  }
}

function setBackgroundSkyGradient(weatherData) {
  const lat = weatherData.location.lat
  const lon = weatherData.location.lon
  const currentTime = new Date()
  const sunTimes = SunCalc.getTimes(currentTime, lat, lon);

  let cloudCover
  let cloudGradient
  let skyGradient

  if (weatherData.current.condition.text === "Overcast") {
    cloudCover = 1.0
  } else {
    cloudCover = weatherData.current.cloud / 100
  }


  if (currentTime > sunTimes.sunrise && currentTime < sunTimes.sunset) {
    skyGradient = "linear-gradient(to top, #89CFF0, #3ca0ff 50%, #3ca0ff)";
    cloudGradient = `linear-gradient(to top, rgba(0, 0, 0, 0), rgba(255, 255, 255, ${cloudCover * 0.75}) 50%, rgba(255, 255, 255, ${cloudCover * 1.5}) 95% )`
  } else if (currentTime > sunTimes.dawn && currentTime < sunTimes.dusk) {
    skyGradient = "linear-gradient(to top, #b86130, #422c3c 60%)";
    cloudGradient = `linear-gradient(to top, rgba(0, 0, 0, 0),  rgba(255, 255, 255, ${cloudCover}))`
  } else {
    skyGradient = "linear-gradient(to top, #0c0c3c, #000000 90%, #000000)";
    cloudGradient = `linear-gradient(to top, rgba(0, 0, 0, 0), rgba(255, 255, 255, ${cloudCover * 0.35}) 50%, rgba(255, 255, 255, ${cloudCover * 0.55}) 100% )`
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

function clearDomContainer(domElement) {
  while (domElement.firstElementChild) {
    domElement.firstElementChild.remove()
  }
}

getForecast(`${location}`);