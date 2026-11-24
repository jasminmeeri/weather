let tempChart = null; // Global chart reference
let forecast = []; // Store fetched 5-day forecast data for reuse
let currentCity = "";
const language = document.documentElement.lang === "en" ? "en" : "fi";

// Look up the city's coordinates and fetch its 5-day forecast
async function getForecast(city, apiKey) {
  const locations = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
    params: { q: city, limit: 1, appid: apiKey }
  });

  const place = locations.data[0];
  if (!place) return [];

  const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
    params: { lat: place.lat, lon: place.lon, units: "metric", appid: apiKey }
  });
  return response.data.list;
}

async function haeSaa() {
  const city = document.querySelector("#kaupunki").value.trim();
  const apiKey = document.querySelector("#apiKey").value.trim();
  const statusEl = document.querySelector("#statusMessage");
  const cityTitleEl = document.querySelector("#cityTitle");

  statusEl.textContent = "";

  // Stop if either input field is empty
  if (!city) {
    statusEl.textContent = "Please enter a city name.";
    return;
  }
  if (!apiKey) {
    statusEl.textContent = "Please enter your API key.";
    return;
  }

  // jQuery bonus: show loading message before the request
  $("#saaYllatys").show();

  try {
    forecast = await getForecast(city, apiKey);

    if (forecast.length === 0) {
      statusEl.textContent = "City not found";
      return;
    }

    currentCity = city;
    cityTitleEl.textContent = currentCity;
    paivitaKaavio();
  } catch (error) {
    console.error("Error fetching data:", error);
    statusEl.textContent =
      language === "en"
        ? "Could not fetch weather data. Check the city name or API key."
        : "Säädatan hakeminen epäonnistui. Tarkista kaupungin nimi tai API-avain.";
  } finally {
    $("#saaYllatys").hide();
  }
}

function piirraKaavio(labels, data, city, type) {
  const ctx = document.getElementById("tempChart").getContext("2d");

  // Destroy the previous chart before creating a new one. made it a bit different
  if (window.tempChart && typeof window.tempChart.destroy === "function") {
    window.tempChart.destroy();
  }

  // Create a new chart, changed the bar and line colors to math the dark green button
  window.tempChart = new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [
        {
          label: `${language === "en" ? "Temperature" : "Lämpötila"} (${city}) °C`,
          data: data,
          borderWidth: 2,
          borderColor: "#2d5a27",
          backgroundColor: "#2d5a27",
          fill: false,
          tension: 0.3,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

function paivitaKaavio() {
  if (forecast.length === 0) return;

  // Use all 3-hour forecast entries with UTC time labels and °C temperatures
  const labels = forecast.map((entry) => entry.dt_txt.slice(0, 16));
  const temperatures = forecast.map((entry) => entry.main.temp);

  // Get the selected chart type and redraw from saved forecast data
  let type = document.getElementById("chartType").value;
  piirraKaavio(labels, temperatures, currentCity, type);
}

// Connect the Get weather button
document.querySelector("#haeSaaPainike").addEventListener("click", haeSaa);

// Added feature: show next forecast time and temperature with SweetAlert2
document.querySelector("#detailsBtn").addEventListener("click", () => {
  if (forecast.length === 0) {
    Swal.fire({
      title: "No forecast loaded",
      text: "Search for a city first to see forecast details.",
      icon: "info",
    });
    return;
  }

  const next = forecast[0];
  Swal.fire({
    title: `Next forecast for ${currentCity}`,
    text: `Time (UTC): ${next.dt_txt.slice(0, 16)} | Temperature: ${next.main.temp} °C`,
    icon: "info",
  });
});