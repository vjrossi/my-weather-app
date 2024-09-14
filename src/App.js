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
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">Weather App</Link>
            </li>
            <li className="nav-item">
              <Link to="/globe" className="nav-link">Globe Weather</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<WeatherApp />} />
          <Route path="/globe" element={<GlobeWeather />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;