import React from 'react';

function WeeklyForecast({ forecast }) {
  const dailyForecasts = forecast.list.filter((item, index) => index % 8 === 0);

  const getWeatherTrend = () => {
    const temps = dailyForecasts.map(day => day.main.temp);
    const weatherTypes = dailyForecasts.map(day => day.weather[0].main.toLowerCase());

    let tempTrend = '';
    if (temps[4] - temps[0] > 3) {
      tempTrend = 'getting warmer';
    } else if (temps[0] - temps[4] > 3) {
      tempTrend = 'getting cooler';
    } else {
      tempTrend = 'staying about the same temperature';
    }

    const rainyDays = weatherTypes.filter(type => type.includes('rain')).length;
    let rainTrend = '';
    if (rainyDays >= 3) {
      rainTrend = 'with frequent rain';
    } else if (rainyDays > 0) {
      rainTrend = 'with some rain';
    }

    return `${tempTrend}${rainTrend ? ', ' + rainTrend : ''}`;
  };

  return (
    <div id="weekly-forecast" style={{
      maxWidth: '500px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>5 day forecast</h2>
      <p style={{ textAlign: 'center', marginBottom: '15px', fontStyle: 'italic' }}>
        {getWeatherTrend()}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {dailyForecasts.map((day, index) => (
          <div key={index} id={`forecast-day-${index}`} style={{ textAlign: 'center' }}>
            <p style={{ margin: '0', fontWeight: 'bold' }}>
              {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
              style={{ width: '50px', height: '50px' }}
            />
            <p style={{ margin: '0' }}>{Math.round(day.main.temp)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyForecast;