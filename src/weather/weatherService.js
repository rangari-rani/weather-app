import { DateTime } from "luxon";

const API_KEY = "56382903a0585276d20366416f092726";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .catch((err) => {
      console.error("API fetch error:", err);
      return null;
    });
};

const formatCurrentWeather = (data) => {
  if (!data) return null;

  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

const formatForecastWeather = (data) => {
  if (!data || !data.list || !data.city) {
    console.error("Forecast data incomplete:", data);
    return { timezone: null, daily: [], hourly: [] };
  }

  const timezoneOffset = data.city.timezone;

  // 🌤️ Daily Forecast: next 5 days at 12:00 PM
  const daily = data.list
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .slice(0, 5)
    .map((d) => ({
      title: formatToLocalTime(d.dt, timezoneOffset, "ccc"),
      temp: d.main.temp,
      icon: d.weather[0].icon,
    }));

  // 🕒 Hourly Forecast: next 5 entries (approx. 15 hours)
  const hourly = data.list.slice(0, 5).map((d) => ({
    title: formatToLocalTime(d.dt, timezoneOffset, "hh:mm a"),
    temp: d.main.temp,
    icon: d.weather[0].icon,
  }));

  return { timezone: timezoneOffset, daily, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  const current = await getWeatherData("weather", searchParams);
  const formattedCurrent = formatCurrentWeather(current);
  if (!formattedCurrent) return null;

  const forecast = await getWeatherData("forecast", {
    q: searchParams.q,
    units: searchParams.units,
  });

  const formattedForecast = formatForecastWeather(forecast);

  return { ...formattedCurrent, ...formattedForecast };
};

// ✅ Correct timezone offset handling
const formatToLocalTime = (
  secs,
  offsetInSeconds,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => {
  return DateTime.fromSeconds(secs + offsetInSeconds)
    .toUTC()
    .toFormat(format);
};

const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;
export { formatToLocalTime, iconUrlFromCode };
