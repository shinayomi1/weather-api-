const apiKey = '19356ea442b71e3b962a22f52960a36e';
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('searchHistory');
let searchHistoryList = [];

searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const cityName = cityInput.value.trim();
  if (cityName) {
    getWeather(cityName);
  }
});

function getWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    })
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
      addToSearchHistory(city);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function displayCurrentWeather(data) {
  const { name, dt, weather, main, wind } = data;
  const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;
  const date = new Date(dt * 1000).toLocaleDateString();
  currentWeather.innerHTML = `
    <h2>${name} (${date}) <img src="${iconUrl}" alt="${weather[0].description}"></h2>
    <p>Temperature: ${main.temp}°C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
  const forecastData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
  forecast.innerHTML = `
    <h2>5-Day Forecast:</h2>
    <div class="forecastItems">
      ${forecastData.map(item => `
        <div class="forecastItem">
          <p>Date: ${item.dt_txt.split(' ')[0]}</p>
          <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
          <p>Temperature: ${item.main.temp}°C</p>
          <p>Humidity: ${item.main.humidity}%</p>
          <p>Wind Speed: ${item.wind.speed} m/s</p>
        </div>
      `).join('')}
    </div>
  `;
}

function addToSearchHistory(city) {
  if (!searchHistoryList.includes(city)) {
    searchHistoryList.push(city);
    searchHistory.innerHTML += `<button onclick="getWeather('${city}')">${city}</button>`;
  }
}
