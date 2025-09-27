 async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";
    const apiKey = "REPLACE WITH YOUR API KEY";

    if (searchInput === "") {
        weatherDataSection.innerHTML = `
        <div>
            <h2> empty input </h2>
            <p>please try again with a valid <u>city name</u>.</p>
        </div>`;
        return;
    }

    async function getLonAndLat() {
        const countryCode = 1;
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;

        const response = await fetch(geocodeURL);

        if (!response.ok) {
            console.log("bad response", response.status);
            return null;
        }

        const data = await response.json();

        if (data.length === 0) {
            weatherDataSection.innerHTML = `
            <div>
                <h2> Invalid city name: "${searchInput}"</h2>
                <p>please try again with a valid <u>city name</u>.</p>
            </div>`;
            return null;
        } else {
            return data[0];
        }
    }

    async function getWeatherData(lon, lat) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        const response = await fetch(weatherURL);
        if (!response.ok) {
            console.log("bad response", response.status);
            return null;
        }
        const data = await response.json();
        return data;
    }

     const geocodeData = await getLonAndLat();
    if (!geocodeData) return; // geçersiz şehir

    const weatherData = await getWeatherData(geocodeData.lon, geocodeData.lat);
    if (!weatherData) return; // fetch başarısız

   

    // HTML güncelle
    weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}" width="100" />
        <div>
            <h2>${weatherData.name}</h2>
            <p><strong>Temperature:</strong> ${Math.round(weatherData.main.temp - 273.15)}°C</p>
            <p><strong>Description:</strong> ${weatherData.weather[0].description}</p>
        </div>
    `;

    document.getElementById("search").value = "";
}
