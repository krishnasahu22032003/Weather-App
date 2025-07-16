// script.js using WeatherAPI.com with Geolocation, 5-day forecast, and dynamic background

const apiKey = "6f2449d90d1249a4acf155841251607"; // Replace with your WeatherAPI.com key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherBox = document.getElementById("weather");
const forecastBox = document.getElementById("forecast");
const errorBox = document.getElementById("error");

// On load, get weather by geolocation
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
      () => {
        console.warn("Geolocation permission denied.");
      }
    );
  }
});

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

async function getWeather(city) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=5`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error(error);
    weatherBox.classList.add("hidden");
    forecastBox.classList.add("hidden");
    errorBox.classList.remove("hidden");
  }
}

async function getWeatherByCoords(lat, lon) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error("Failed to fetch geolocation weather", error);
  }
}

function displayWeather(data) {
  errorBox.classList.add("hidden");
  weatherBox.classList.remove("hidden");
  forecastBox.classList.remove("hidden");

  const condition = data.current.condition.text.toLowerCase();
  changeBackground(condition);

  document.getElementById("city").textContent = `${data.location.name}, ${data.location.country}`;
  document.getElementById("date").textContent = new Date().toLocaleString();
  document.getElementById("temperature").textContent = `${Math.round(data.current.temp_c)}°C`;
  document.getElementById("description").textContent = data.current.condition.text;
  document.getElementById("humidity").textContent = data.current.humidity;
  document.getElementById("wind").textContent = data.current.wind_kph.toFixed(1);
  document.getElementById("icon").src = `https:${data.current.condition.icon}`;
  document.getElementById("icon").alt = data.current.condition.text;

  renderForecast(data.forecast.forecastday);
}

function renderForecast(days) {
  forecastBox.innerHTML = "";
  days.forEach((day) => {
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <p>${day.date}</p>
      <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
      <p>${day.day.avgtemp_c}°C</p>
      <p>${day.day.condition.text}</p>
    `;
    forecastBox.appendChild(card);
  });
}

function changeBackground(condition) {
  const body = document.body;
  if (condition.includes("rain")) {
    body.style.background = "linear-gradient(#37474f, #90a4ae)";
  } else if (condition.includes("cloud")) {
    body.style.background = "linear-gradient(#607d8b, #cfd8dc)";
  } else if (condition.includes("sun") || condition.includes("clear")) {
    body.style.background = "linear-gradient(#ffe082, #ffca28)";
  } else if (condition.includes("snow")) {
    body.style.background = "linear-gradient(#e0f7fa, #b2ebf2)";
  } else {
    body.style.background = "linear-gradient(#546e7a, #b0bec5)";
  }
}