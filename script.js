const apiKey = "a0026619173ec7cc6bb261f50b0b3842"; 
let isCelsius = true; 

async function getWeather() {
    const city = document.getElementById("city").value.trim();
    const weatherInfo = document.getElementById("weather-info");
    const errorMessage = document.getElementById("error-message");
    const loader = document.getElementById("loader");
    const forecastContainer = document.getElementById("forecast-container");
    const forecastSection = document.getElementById("forecast");

    weatherInfo.classList.add("hidden");
    errorMessage.classList.add("hidden");
    forecastSection.classList.add("hidden");

    if (!city) {
        errorMessage.textContent = "❌ Please enter a city name.";
        errorMessage.classList.remove("hidden");
        return;
    }

    loader.classList.remove("hidden");

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(url), fetch(forecastUrl)
        ]);

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        loader.classList.add("hidden");

        if (weatherData.cod !== 200) {
            errorMessage.textContent = "❌ City not found. Please try again.";
            errorMessage.classList.remove("hidden");
            return;
        }

        document.getElementById("city-name").innerText = `${weatherData.name}, ${weatherData.sys.country}`;
        updateTemperature(weatherData.main.temp);
        document.getElementById("weather-condition").innerText = `🌥 Weather: ${weatherData.weather[0].description}`;
        document.getElementById("humidity").innerText = `💧 Humidity: ${weatherData.main.humidity}%`;
        document.getElementById("wind-speed").innerText = `🌬 Wind Speed: ${weatherData.wind.speed} m/s`;
        document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

        weatherInfo.classList.remove("hidden");

        forecastContainer.innerHTML = "";
        forecastData.list.filter((_, index) => index % 8 === 0).forEach(day => {
            const forecastElement = `
                <div class="forecast-card">
                    <p>${new Date(day.dt_txt).toDateString()}</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                    <p>${day.main.temp}°C</p>
                </div>
            `;
            forecastContainer.innerHTML += forecastElement;
        });

        forecastSection.classList.remove("hidden");

    } catch (error) {
        loader.classList.add("hidden");
        errorMessage.textContent = "⚠️ Error fetching weather. Please try again.";
        errorMessage.classList.remove("hidden");
    }
}

function updateTemperature(temp) {
    const tempElement = document.getElementById("temperature");
    tempElement.innerText = `🌡 Temperature: ${isCelsius ? temp : (temp * 9/5 + 32).toFixed(2)}°${isCelsius ? 'C' : 'F'}`;
}

document.getElementById("unit-toggle").addEventListener("click", () => {
    isCelsius = !isCelsius;
    updateTemperature(parseFloat(document.getElementById("temperature").innerText.split(" ")[2]));
});

document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
