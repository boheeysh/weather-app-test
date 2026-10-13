# Weather App

간단한 날씨 웹앱입니다. 사용자가 도시 이름을 입력하면 현재 날씨와 앞으로 15일 예보를 보여줍니다.

## 기능
- 도시 이름 입력
- 현재 날씨 조회
- 습도, 풍속, 시간 표시
- 앞으로 15일의 최고/최저 온도 표시
- 무료 날씨 API 사용 (Open-Meteo)
- API Key 없이 사용 가능

## 폴더 구조

```text
weather/
├── README.md
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── .gitignore
```

## 실행 방법

1. backend 폴더로 이동
   ```bash
   cd backend
   ```

2. 의존성 설치
   ```bash
   npm install
   ```

3. 서버 실행
   ```bash
   npm start
   ```

4. 브라우저에서 접속
   ```text
   http://localhost:3000
   ```

5. 도시 이름 입력 후 "날씨 확인" 버튼을 누르면 현재 날씨가 표시됩니다.

## 기술 스택
- HTML
- CSS
- JavaScript
- Node.js
- Express
- Open-Meteo API

## 참고
- 외부 API는 Open-Meteo를 사용합니다.
- API Key가 필요하지 않습니다.
- 한국어 도시 이름 입력도 보완 처리되어 있습니다.
