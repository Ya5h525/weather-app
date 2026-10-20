


const inputField = document.getElementById('inputId');
let searchinput;
const searchOptionsContainer = document.getElementById('searchOptionsContainer')

const searchbutton = document.getElementById('submitSearch')
let coordinates;
searchbutton.addEventListener('click', function (e) {
    e.preventDefault();

    searchinput = formatString(inputField.value);

    citySearch()

})
let cityJson;
const ul = document.createElement('UL');
async function citySearch() {
    ul.replaceChildren();
    const jsonCitylink = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchinput)}&count=10&language=en&format=json`
    const responce = await fetch(jsonCitylink)
    cityJson = await responce.json();
    console.log(cityJson)
    console.log(typeof(cityJson))
    console.log(cityJson.toString())
    cityJson.results.forEach(element => {
    
    const li = document.createElement('li');
    li.textContent =`📍  ${element.name} - ${element.admin1 } , ${element.country }`  
    ul.appendChild(li)
    searchOptionsContainer.appendChild(ul)
    
});


}
//we got a array of cities with the name of the searchinput(cityname) we entered

function formatString(str) {
    if (!str) return "";


    const cleanedStr = str.trim();

    if (!cleanedStr) return ""; //

    return cleanedStr.charAt(0).toUpperCase() + cleanedStr.slice(1).toLowerCase();
}