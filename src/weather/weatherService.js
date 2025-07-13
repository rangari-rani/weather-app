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
      return null; // prevent crash
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
  if (!data || !data.daily || !data.hourly) {
    console.error("Forecast data incomplete:", data);
    return { timezone: null, daily: [], hourly: [] };
  }

  const { timezone } = data;

  const daily = data.daily.slice(1, 6).map((d) => ({
    title: formatToLocalTime(d.dt, timezone, "ccc"),
    temp: d.temp.day,
    icon: d.weather[0].icon,
  }));

  const hourly = data.hourly.slice(1, 6).map((d) => ({
    title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
    temp: d.temp,
    icon: d.weather[0].icon,
  }));

  return { timezone, daily, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  const currentData = await getWeatherData("weather", searchParams);
  const formattedCurrentWeather = formatCurrentWeather(currentData);

  if (!formattedCurrentWeather) {
    console.warn("Current weather data is null — skipping forecast.");
    return null;
  }

  const { lat, lon } = formattedCurrentWeather;

  const forecastData = await getWeatherData("onecall", {
    lat,
    lon,
    exclude: "current,minutely,alerts",
    units: searchParams.units,
  });

  const formattedForecastWeather = formatForecastWeather(forecastData);

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;
export { formatToLocalTime, iconUrlFromCode };
