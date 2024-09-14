import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import WeatherApp from './components/WeatherApp';
import GlobeWeather from './components/GlobeWeather';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GlobeWeather />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;