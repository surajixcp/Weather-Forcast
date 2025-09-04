import React, { useState, useEffect, useRef } from "react";
import "./Weather.css";

// Assets
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

const Weather = () => {
  const inputRef = useRef();
  const [city, setCity] = useState("London");
  const [weatherData, setWeatherData] = useState(null);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
    "50d": wind_icon,
    "50n": wind_icon,
  };

  const search = async (City) => {
    if (!City) {
      alert("Please enter a city name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${City}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod !== 200) {
        setWeatherData(null);
        alert("City not found");
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(null);
    }
  };

  useEffect(() => {
    search("London");
  }, []);

  return (
    <div className="weather">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <img
          src={search_icon}
          alt="Search"
          className="search-icon"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {/* Weather Info */}
      {weatherData && (
        <>
          <div className="weather-info">
            <img
              src={weatherData.icon}
              alt="Weather Icon"
              className="weather-icon"
            />
            <p className="temperature">{weatherData.temperature}°C</p>
            <p className="location">{weatherData.location}</p>
          </div>

          {/* Extra Weather Data */}
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="Wind Speed" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
