import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoidmpyb3NzaSIsImEiOiJjbHNjb2lzeTQwczJ3MmpxbWh4d2E2YmUwIn0.AvyOfpd5nrPWWMGhpdaZxw';

function GlobeWeather() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [weather, setWeather] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

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
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod === '404') {
        console.error('Location not found');
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeather(null);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div>
      <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
      {weather ? (
        <div className="weather-info" style={{
          backgroundColor: '#f0f0f0',
          padding: '20px',
          borderRadius: '10px',
          margin: '20px 0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <img src={getWeatherIcon(weather.weather[0].icon)} alt="Weather Icon" />
            <h2>Weather for {weather.name}</h2>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Description: {weather.weather[0].description}</p>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <p>Click on the map to get weather information for that location.</p>
        </div>
      )}
    </div>
  );
}

export default GlobeWeather;