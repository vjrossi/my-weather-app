import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './GlobeWeather.module.css';
import WeeklyForecast from './WeeklyForecast';

mapboxgl.accessToken = 'pk.eyJ1Ijoidmpyb3NzaSIsImEiOiJjbHNjb2lzeTQwczJ3MmpxbWh4d2E2YmUwIn0.AvyOfpd5nrPWWMGhpdaZxw';

function GlobeWeather() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [weather, setWeather] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [location, setLocation] = useState('');

  useEffect(() => {
    async function getUserLocation() {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return [data.longitude, data.latitude];
      } catch (error) {
        console.error("IP geolocation failed:", error);
        // Fallback to a default location (e.g., New York City)
        return [-74.006, 40.7128];
      }
    }

    getUserLocation().then(location => {
      setUserLocation(location);
    });
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: userLocation,
      zoom: 10,
      projection: 'globe'
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      fetchWeather(lat, lng);
    });

    map.current.getCanvas().style.cursor = 'crosshair';

    // Add a marker for the user's location
    new mapboxgl.Marker()
      .setLngLat(userLocation)
      .addTo(map.current);

    // Fetch weather for the user's location on initial load
    fetchWeather(userLocation[1], userLocation[0]);
  }, [userLocation]);

  const fetchWeather = async (lat, lon) => {
    const API_KEY = '9a90a19b627e8512a82bee7d66a0b793';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl)
      ]);
      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      if (currentData.cod === '404' || forecastData.cod === '404') {
        console.error('Location not found');
        setWeather(null);
        setLocation('');
      } else {
        setWeather({
          current: currentData,
          forecast: forecastData
        });
        setLocation(currentData.name); // Set the location name
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeather(null);
      setLocation('');
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWeatherColor = (iconCode) => {
    // Adjust the color palette for better contrast
    const colorMap = {
      '01d': '#87CEEB', // Sky Blue for clear day
      '01n': '#191970', // Midnight Blue for clear night
      '02d': '#B0C4DE', // Light Steel Blue for few clouds day
      '02n': '#4B0082', // Indigo for few clouds night
      '03d': '#778899', // Light Slate Gray for scattered clouds day
      '03n': '#2F4F4F', // Dark Slate Gray for scattered clouds night
      '04d': '#708090', // Slate Gray for broken clouds day
      '04n': '#36454F', // Charcoal for broken clouds night
      '09d': '#4682B4', // Steel Blue for shower rain day
      '09n': '#000080', // Navy for shower rain night
      '10d': '#4169E1', // Royal Blue for rain day
      '10n': '#00008B', // Dark Blue for rain night
      '11d': '#483D8B', // Dark Slate Blue for thunderstorm day
      '11n': '#191970', // Midnight Blue for thunderstorm night
      '13d': '#B0E0E6', // Powder Blue for snow day
      '13n': '#6A5ACD', // Slate Blue for snow night
      '50d': '#D3D3D3', // Light Gray for mist day
      '50n': '#696969', // Dim Gray for mist night
    };
    return colorMap[iconCode] || '#87CEEB'; // Default to Sky Blue
  };

  const getTextColor = (backgroundColor) => {
    // Ensure high contrast for text
    const rgb = backgroundColor.match(/\d+/g);
    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
    return brightness > 125 ? '#000000' : '#FFFFFF';
  };

  return (
    <div>
      <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
      {weather ? (
        <>
          <div className="weather-info" style={{
            backgroundColor: getWeatherColor(weather.current.weather[0].icon),
            color: getTextColor(getWeatherColor(weather.current.weather[0].icon)),
            padding: '20px',
            borderRadius: '8px',
            margin: '20px auto',
            maxWidth: '500px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'normal', margin: 0 }}>
                Weather in {location} {/* Display the location name */}
              </h2>
              <p style={{ fontSize: '14px', margin: 0 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: 'numeric' })}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
              <img
                src={getWeatherIcon(weather.current.weather[0].icon)}
                alt="Weather Icon"
                style={{ width: '64px', height: '64px', marginRight: '20px' }}
              />
              <div>
                <h1 style={{ fontSize: '48px', fontWeight: 'normal', margin: '0' }}>
                  {Math.round(weather.current.main.temp)}°C
                </h1>
                <p style={{ fontSize: '16px', margin: '5px 0', textTransform: 'capitalize' }}>
                  {weather.current.weather[0].description}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', fontSize: '14px', justifyContent: 'center', marginTop: '10px' }}>
              <p style={{ margin: '0 20px 0 0', fontWeight: 'bold' }}>Precipitation: {weather.current.rain ? `${weather.current.rain['1h']}mm` : '0mm'}</p>
              <p style={{ margin: '0 20px 0 0', fontWeight: 'bold' }}>Humidity: {weather.current.main.humidity}%</p>
              <p style={{ margin: '0', fontWeight: 'bold' }}>Wind: {Math.round(weather.current.wind.speed * 3.6)} km/h</p>
            </div>
          </div>
          <WeeklyForecast forecast={weather.forecast} />
        </>
      ) : (
        <div className="mt-3">
          <p>Click on the map to get weather information for that location.</p>
        </div>
      )}
    </div>
  );
}

export default GlobeWeather;