# 🌦️ React Weather App

A modern weather forecast application built with **React**, **Tailwind CSS**, and **Luxon**, powered by the [OpenWeatherMap API](https://openweathermap.org/api). It gives real-time weather conditions, hourly and daily forecasts, and handles timezone conversions manually for accuracy.

---

## 🚀 Live Demo

👉 [Try it on Vercel](https://weather-app-bice-alpha-21.vercel.app/)

---

## 📸 Screenshots

> Add your screenshots here after deployment (`public/ss1.png`, `ss2.png`...)

| Home | Forecast |
|------|----------|
| ![Screenshot 1](https://github.com/rangari-rani/weather-app/blob/b88ee15722120604f1677292df8ca919bf1430e2/page1.png) 
![Screenshot 2](https://github.com/rangari-rani/weather-app/blob/b88ee15722120604f1677292df8ca919bf1430e2/page2.png)  

---

## ✨ Features

- 🔍 City-based search (e.g., Mumbai, Berlin)
- 📍 Get current location weather using browser GPS
- 🌡️ Toggle between Celsius (°C) and Fahrenheit (°F)
- ⏳ Accurate 5-day forecast (daily at 12PM)
- 🕒 Real-time hourly forecast (next 5 entries)
- ⚠️ Toast notifications for loading state and errors
- 💡 Mobile responsive UI with Tailwind CSS
- 🌐 **Manual timezone correction** using UTC offset

---

## 🧠 Notable Challenge Solved

### 🕒 Accurate Local Forecast Time using `/forecast` API

Unlike `/onecall`, OpenWeather's `/forecast` API returns only a raw `timezone` offset in seconds (e.g., `19800` for India).  
Instead of hardcoding or defaulting to UTC, this app:

- Adjusts all timestamps by `dt + timezone`
- Uses **Luxon** to format corrected time in readable form
- Ensures that forecast times match the **real local time** of the selected city

This avoids the common bug where apps show wrong dates like “27 July” instead of “13 July” for cities like Nagpur.

---

## 🛠️ Tech Stack

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Luxon](https://moment.github.io/luxon/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [OpenWeatherMap API](https://openweathermap.org/api)

---

## 📁 Folder Structure (Monorepo)

```
weather-app/
├── public/
├── src/
│ ├── components/   # Forecast, Inputs, TemperatureDetails, TimeAndLocation, TopButtons
│ ├── weather/      # API and data formatting logic
│ ├── App.js
│ └── index.js
├── tailwind.config.js
└── package.json
```

---

## ⚙️ Setup Instructions

1. **Clone this repo**
   ```bash
   git clone https://github.com/rangari-rani/weather-app.git
   cd weather-app
```

