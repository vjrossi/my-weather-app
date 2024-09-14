import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
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