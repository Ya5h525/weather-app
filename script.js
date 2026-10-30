// global elements and variables
const sideNavBar = document.getElementById('sideNav');
const settingTemplate = document.getElementById('settingTemplate');
const mainContent = document.getElementById('mainContent');
const overviewTemplate = document.getElementById('overviewTemplate');
const forcastTemplate = document.getElementById('forcastTemplate');

let searchinput;
let cityJson;
let weatherData;
let selectedCity;

const ul = document.createElement('ul');

// handle search and dark mode clicks via event delegation on mainContent
mainContent.addEventListener('click', function (e) {
    const searchButton = e.target.closest('#submitSearch');

    if (searchButton) {
        e.preventDefault();

        const inputField = mainContent.querySelector('#inputId');
        const searchOptionsContainer = mainContent.querySelector('#searchOptionsContainer');

        if (!inputField || !searchOptionsContainer) return;

        searchinput = formatString(inputField.value);
        if (!searchinput) return;

        citySearch(searchOptionsContainer);
    }

    const darkModeButton = e.target.closest('#darkModeButton');
    if (darkModeButton) {
        if (body.classList.contains('darkmode')) {
            disableDarkmode(darkModeButton);
        } else {
            enabledarkmode(darkModeButton);
        }
    }
});

// fetch city suggestions
async function citySearch(searchOptionsContainer) {
    ul.replaceChildren();

    const jsonCitylink = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchinput)}&count=10&language=en&format=json`;

    try {
        const response = await fetch(jsonCitylink);
        cityJson = await response.json();

        if (!cityJson.results || cityJson.results.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No cities found';
            ul.appendChild(li);
        } else {
            cityJson.results.forEach((element, index) => {
                const li = document.createElement('li');
                li.textContent = `📍 ${element.name} - ${element.admin1 || ''}, ${element.country}`;
                li.dataset.index = index;
                ul.appendChild(li);
            });
        }
        searchOptionsContainer.appendChild(ul);
    } catch (error) {
        console.error('City search failed:', error);
    }
}

// handle city selection from dropdown
ul.addEventListener('click', function (e) {
    const selectedOption = e.target.closest('li');
    if (!selectedOption || !ul.contains(selectedOption)) return;

    const latlongid = Number(selectedOption.dataset.index);
    const cityData = cityJson.results[latlongid];
    
    if (!cityData) return;

    selectedCity = {
        name: cityData.name,
        country: cityData.country,
        admin1: cityData.admin1,
        latitude: cityData.latitude,
        longitude: cityData.longitude
    };

    const cityElement = mainContent.querySelector('.city-name');
    const countryElement = mainContent.querySelector('.country-name');

    if (cityElement) {
        cityElement.textContent = selectedCity.name;
    }
    if (countryElement) {
        countryElement.textContent = `${selectedCity.admin1 || ''}, ${selectedCity.country}`;
    }

    changeWeather();
    ul.remove();
});

// fetch weather data for the selected city
async function getWeatherData() {
    if (!selectedCity) return;

    const weatherApiLink = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&daily=temperature_2m_mean,apparent_temperature_mean,cloud_cover_mean,relative_humidity_2m_mean,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,rain,precipitation,weather_code,cloud_cover&timezone=auto`;
    const response = await fetch(weatherApiLink);
    weatherData = await response.json();
}

// update the overview tab with current weather
async function changeWeather() {
    if (!selectedCity) return;

    const humidity = mainContent.querySelector('#humi');
    const temperature = mainContent.querySelector('#tempu');
    const apparentTemperature = mainContent.querySelector('#reTemp');
    const windSpeed = mainContent.querySelector('#windSpeed');
    const weatherEmoji = mainContent.querySelector('#weatherEmoji');
    const weatherCaption = mainContent.querySelector('#weatherCaption');

    await getWeatherData();

    const currentWeather = weatherData.current;
    const weatherlogo = getWeather(currentWeather.weather_code);

    if (weatherEmoji) weatherEmoji.textContent = weatherlogo.weatherEmoji;
    if (weatherCaption) weatherCaption.textContent = weatherlogo.weatherCaption;
    if (humidity) humidity.textContent = currentWeather.relative_humidity_2m;
    if (temperature) temperature.textContent = `${currentWeather.temperature_2m}°`;
    if (apparentTemperature) apparentTemperature.textContent = `${currentWeather.apparent_temperature}°`;
    if (windSpeed) windSpeed.textContent = currentWeather.wind_speed_10m;
}

// update the forecast tab cards
async function changeForcast() {
    if (!selectedCity) return;

    const forecastDays = mainContent.querySelectorAll('.forecast-day');
    await getWeatherData();

    const forecastCity = mainContent.querySelector('.forecast-city');
    if (forecastCity) {
        forecastCity.textContent = `${selectedCity.name}, ${selectedCity.country}`;
    }

    const forecastWeather = weatherData.daily;

    forecastDays.forEach((day, index) => {
        const [year, month, days] = forecastWeather.time[index].split('-');
        const today = new Date();
        const forecastDate = new Date(year, month - 1, days);
        const forecastIconAndCaption = getWeather(forecastWeather.weather_code[index]);

        if (forecastDate.toDateString() === today.toDateString()) {
            day.querySelector('.forecast-day-name h3').textContent = 'Today';
        } else {
            day.querySelector('.forecast-day-name h3').textContent = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
        }

        day.querySelector('.forecast-day-name p').textContent = forecastDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        day.querySelector('.forecast-weather-icon').textContent = forecastIconAndCaption.weatherEmoji;
        day.querySelector('.forecast-weather span:last-child').textContent = forecastIconAndCaption.weatherCaption;
        day.querySelector('.forecast-humidity span:last-child').textContent = `${forecastWeather.relative_humidity_2m_mean[index]} %`;
        day.querySelector('.forecast-temperatures strong').textContent = forecastWeather.temperature_2m_mean[index];
        day.querySelector('.forecast-temperatures span').textContent = forecastWeather.apparent_temperature_mean[index];
    });
}

// helper to capitalize search input
function formatString(str) {
    if (!str) return '';
    const cleanedStr = str.trim();
    if (!cleanedStr) return '';
    return cleanedStr.charAt(0).toUpperCase() + cleanedStr.slice(1).toLowerCase();
}

// clock logic for the overview tab
function clockrun() {
    const timeElement = mainContent.querySelector('#timeId');
    const dateElement = mainContent.querySelector('#dateId');

    if (!timeElement || !dateElement) return;

    const now = new Date();
    let hour = now.getHours();
    const AmPm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12 || 12;
    hour = hour.toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');

    timeElement.textContent = `${hour}:${min}${AmPm}`;

    const fullDateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    dateElement.textContent = fullDateString;
}

clockrun();
setInterval(clockrun, 30000);

// handle sidebar navigation and templates
sideNavBar.addEventListener('click', function (e) {
    const navItem = e.target.closest('.nav-button');
    if (!navItem || !sideNavBar.contains(navItem)) return;

    sideNavBar.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
    });
    navItem.classList.add('active');

    if (navItem.id === 'setting') {
        const set = settingTemplate.content.cloneNode(true);
        mainContent.replaceChildren(set);

        const darkModeButton = mainContent.querySelector('#darkModeButton');
        if (darkModeButton) {
            darkModeButton.textContent = body.classList.contains('darkmode') ? 'Enable light mode' : 'Enable dark mode';
        }
    } 
    else if (navItem.id === 'over') {
        const over = overviewTemplate.content.cloneNode(true);
        mainContent.replaceChildren(over);
        clockrun();

        if (selectedCity) {
            const cityElement = mainContent.querySelector('.city-name');
            const countryElement = mainContent.querySelector('.country-name');

            if (cityElement) cityElement.textContent = selectedCity.name;
            if (countryElement) countryElement.textContent = `${selectedCity.admin1 || ''}, ${selectedCity.country}`;
            
            changeWeather();
        }
    } 
    else if (navItem.id === 'forca') {
        const forca = forcastTemplate.content.cloneNode(true);
        mainContent.replaceChildren(forca);
        changeForcast();
    }
});

// dark mode toggle logic
const body = document.body;
let darkmode = localStorage.getItem('darkmode');

if (darkmode === 'active') {
    enabledarkmode();
} else {
    disableDarkmode();
}

function enabledarkmode(button) {
    localStorage.setItem('darkmode', 'active');
    body.classList.add('darkmode');
    if (button) {
        button.textContent = 'Enable light mode';
    }
}

function disableDarkmode(button) {
    localStorage.removeItem('darkmode');
    body.classList.remove('darkmode');
    if (button) {
        button.textContent = 'Enable dark mode';
    }
}

// map wmo weather codes to emojis and captions
function getWeather(code) {
    switch (code) {
        case 0: return { weatherCaption: "Clear sky", weatherEmoji: "☀️" };
        case 1: return { weatherCaption: "Mainly clear", weatherEmoji: "🌤️" };
        case 2: return { weatherCaption: "Partly cloudy", weatherEmoji: "⛅" };
        case 3: return { weatherCaption: "Overcast", weatherEmoji: "☁️" };
        case 45: case 48: return { weatherCaption: "Fog", weatherEmoji: "🌫️" };
        case 51: case 52: case 53: case 54: case 55: return { weatherCaption: "Drizzle", weatherEmoji: "🌦️" };
        case 61: case 62: case 63: case 64: case 65: return { weatherCaption: "Rain", weatherEmoji: "🌧️" };
        case 71: case 72: case 73: case 74: case 75: case 76: case 77: return { weatherCaption: "Snow", weatherEmoji: "❄️" };
        case 80: case 81: case 82: return { weatherCaption: "Rain showers", weatherEmoji: "🌦️" };
        case 95: case 96: case 97: case 98: case 99: return { weatherCaption: "Thunderstorm", weatherEmoji: "⛈️" };
        default: return { weatherCaption: "Unknown weather code", weatherEmoji: "❓" };
    }
}