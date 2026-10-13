const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('weather-result');
const cityNameEl = document.getElementById('city-name');
const countryNameEl = document.getElementById('country-name');
const temperatureEl = document.getElementById('temperature');
const weatherDescriptionEl = document.getElementById('weather-description');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const weatherTimeEl = document.getElementById('weather-time');
const forecastListEl = document.getElementById('forecast-list');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    showStatus('도시 이름을 입력해주세요.');
    return;
  }

  showStatus('날씨를 불러오는 중입니다...');

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '날씨 정보를 불러오지 못했습니다.');
    }

    renderWeather(data);
    showStatus('');
  } catch (error) {
    showStatus(error.message || '오류가 발생했습니다.');
    resultEl.classList.add('hidden');
  }
});

function renderWeather(data) {
  cityNameEl.textContent = data.city;
  countryNameEl.textContent = data.country;
  temperatureEl.textContent = `${data.temperature}°C`;
  weatherDescriptionEl.textContent = data.description;
  humidityEl.textContent = `${data.humidity}%`;
  windSpeedEl.textContent = `${data.windSpeed} km/h`;
  weatherTimeEl.textContent = new Date(data.time).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  renderForecast(data.forecast || []);
  resultEl.classList.remove('hidden');
}

function renderForecast(forecast) {
  if (!forecast.length) {
    forecastListEl.innerHTML = '';
    return;
  }

  forecastListEl.innerHTML = forecast
    .map((item) => {
      const date = new Date(item.date);
      const label = date.toLocaleDateString('ko-KR', {
        month: 'numeric',
        day: 'numeric'
      });

      return `
        <div class="forecast-item">
          <div class="forecast-date">${label}</div>
          <div class="forecast-desc">${item.description}</div>
          <div class="forecast-temp">
            <span class="max-temp">${Math.round(item.maxTemp)}°</span>
            <span class="min-temp">${Math.round(item.minTemp)}°</span>
          </div>
        </div>
      `;
    })
    .join('');
}

function showStatus(message) {
  statusEl.textContent = message;
}
