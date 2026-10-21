
const humidity = document.getElementById('humi');
const temperature = document.getElementById('tempu');
const apparentTemperature = document.getElementById('reTemp');
const windSpeed = document.getElementById('windSpeed');

const inputField = document.getElementById('inputId');
const searchOptionsContainer = document.getElementById('searchOptionsContainer');
const searchbutton = document.getElementById('submitSearch');

let searchinput;
let cityJson;
let weatherData;

let lat = [];
let long = [];
let latlongid;

const ul = document.createElement('ul');

searchbutton.addEventListener('click', function(e) {
    e.preventDefault();
    searchinput = formatString(inputField.value);
    citySearch();
});

async function citySearch() {
    ul.replaceChildren();
    lat = [];
    long = [];

    const jsonCitylink = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchinput)}&count=10&language=en&format=json`;

    const responce = await fetch(jsonCitylink);
    cityJson = await responce.json();

    cityJson.results.forEach((element, index) => {
        const li = document.createElement('li');

        li.textContent = `📍 ${element.name} - ${element.admin1}, ${element.country}`;
        li.id = `${index}`;

        ul.appendChild(li);

        lat.push(element.latitude);
        long.push(element.longitude);
    });

    searchOptionsContainer.appendChild(ul);
}

ul.addEventListener('click', function(e) {
    if (e.target.tagName !== 'LI') return;

    latlongid = Number(e.target.id);

    document.querySelector('.city-name').textContent =
        cityJson.results[latlongid].name;

    document.querySelector('.country-name').textContent =
        `${cityJson.results[latlongid].admin1}, ${cityJson.results[latlongid].country}`;

    changeWeather();
    ul.remove();
});

async function getWeatherData() {
    const weatherApiLink = `https://api.open-meteo.com/v1/forecast?latitude=${lat[latlongid]}&longitude=${long[latlongid]}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,rain,precipitation,cloud_cover&timezone=auto`;

    const responce = await fetch(weatherApiLink);
    weatherData = await responce.json();
}

async function changeWeather() {
    await getWeatherData();

    let currentWeather = weatherData.current;

    humidity.textContent = currentWeather.relative_humidity_2m;
    temperature.textContent = `${currentWeather.temperature_2m}°`;
    apparentTemperature.textContent = `${currentWeather.apparent_temperature}°`;
    windSpeed.textContent = currentWeather.wind_speed_10m;
}

function formatString(str) {
    if (!str) return '';

    const cleanedStr = str.trim();
    if (!cleanedStr) return '';

    return cleanedStr.charAt(0).toUpperCase() + cleanedStr.slice(1).toLowerCase();
}

function clockrun() {
    const now = new Date();

    let hour = now.getHours();
    const AmPm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12 || 12;
    hour = hour.toString().padStart(2, '0');

    const min = now.getMinutes().toString().padStart(2, '0');

    document.getElementById('timeId').textContent = `${hour}:${min}${AmPm}`;

    const fullDateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    document.getElementById('dateId').textContent = fullDateString;
}

clockrun();
setInterval(clockrun, 30000);

