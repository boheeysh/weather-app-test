const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendPath = path.join(__dirname, '..', 'frontend');

app.use(express.static(frontendPath));

function getWeatherDescription(code) {
  const weatherMap = {
    0: '맑음',
    1: '대체로 맑음',
    2: '부분적으로 흐림',
    3: '흐림',
    45: '안개',
    48: '짙은 안개',
    51: '약한 이슬비',
    53: '이슬비',
    55: '강한 이슬비',
    56: '약한 언더 비',
    57: '강한 언더 비',
    61: '약한 비',
    63: '비',
    65: '강한 비',
    66: '약한 우박 비',
    67: '강한 우박 비',
    71: '약한 눈',
    73: '눈',
    75: '강한 눈',
    77: '눈알',
    80: '약한 소나기',
    81: '소나기',
    82: '강한 소나기',
    85: '약한 눈 소나기',
    86: '강한 눈 소나기',
    95: '천둥번개',
    96: '천둥번개(우박)',
    99: '강한 천둥번개(우박)'
  };

  return weatherMap[code] || '날씨 정보';
}

const cityAliasMap = {
  서울: ['Seoul', '서울특별시'],
  서울특별시: ['Seoul', '서울'],
  부산: ['Busan', '부산광역시'],
  부산광역시: ['Busan', '부산'],
  대구: ['Daegu', '대구광역시'],
  대구광역시: ['Daegu', '대구'],
  인천: ['Incheon', '인천광역시'],
  인천광역시: ['Incheon', '인천'],
  광주: ['Gwangju', '광주광역시'],
  광주광역시: ['Gwangju', '광주'],
  대전: ['Daejeon', '대전광역시'],
  대전광역시: ['Daejeon', '대전'],
  울산: ['Ulsan', '울산광역시'],
  울산광역시: ['Ulsan', '울산'],
  제주: ['Jeju', '제주특별자치도'],
  제주특별자치도: ['Jeju', '제주'],
  수원: ['Suwon'],
  용인: ['Yongin'],
  고양: ['Goyang'],
  성남: ['Seongnam'],
  청주: ['Cheongju'],
  전주: ['Jeonju'],
  춘천: ['Chuncheon'],
  강릉: ['Gangneung']
};

function getSearchCandidates(city) {
  const normalized = city.trim();
  const candidates = [normalized];
  const aliasList = cityAliasMap[normalized] || [];

  for (const alias of aliasList) {
    if (!candidates.includes(alias)) {
      candidates.push(alias);
    }
  }

  return [...new Set(candidates)];
}

async function findLocation(city) {
  const candidates = getSearchCandidates(city);

  for (const candidate of candidates) {
    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(candidate)}&count=5&language=ko&format=json`
      );

      const geoData = await geoResponse.json();
      const location = geoData.results?.[0];

      if (location) {
        return location;
      }
    } catch (error) {
      console.warn(`도시 검색 실패: ${candidate}`, error);
    }
  }

  return null;
}

app.get('/api/weather', async (req, res) => {
  const city = (req.query.city || '').trim();

  if (!city) {
    return res.status(400).json({ error: '도시 이름을 입력해주세요.' });
  }

  try {
    const location = await findLocation(city);

    if (!location) {
      return res.status(404).json({ error: '해당 도시를 찾을 수 없습니다.' });
    }

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=15&language=ko`
    );

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    const daily = weatherData.daily || {};

    const forecast = (daily.time || []).map((date, index) => ({
      date,
      weatherCode: daily.weather_code?.[index],
      description: getWeatherDescription(daily.weather_code?.[index]),
      minTemp: daily.temperature_2m_min?.[index],
      maxTemp: daily.temperature_2m_max?.[index]
    }));

    const payload = {
      city: location.name,
      country: location.country,
      state: location.admin1 || '',
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      description: getWeatherDescription(current.weather_code),
      time: current.time,
      forecast
    };

    res.json(payload);
  } catch (error) {
    console.error('날씨 API 호출 중 에러 발생:', error);
    res.status(500).json({ error: '날씨 정보를 불러오지 못했습니다.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
