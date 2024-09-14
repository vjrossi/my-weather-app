import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, ListGroup } from 'react-bootstrap';

const StyledContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  background: ${props => props.bgColor || 'linear-gradient(to right, #36d1dc, #5b86e5)'};
  transition: background 0.5s ease;
`;

const WeatherCard = styled(Card)`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const WeatherIcon = styled.i`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const RecentSearches = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const RecentSearchButton = styled(Button)`
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
`;

const WeatherApp = () => {
    const [address, setAddress] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const API_KEY = '9a90a19b627e8512a82bee7d66a0b793'; // Your OpenWeatherMap API key

    useEffect(() => {
        if (address.length > 2) {
            fetchSuggestions(address);
        } else {
            setSuggestions([]);
        }
    }, [address]);

    const fetchSuggestions = async (query) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSuggestions(data.slice(0, 5)); // Limit to 5 suggestions
        } catch (err) {
            console.error('Error fetching suggestions:', err);
        }
    };

    const fetchWeather = async (lat, lon) => {
        setLoading(true);
        setError('');
        try {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            setWeather(data);
            updateRecentSearches(address);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateRecentSearches = (searchAddress) => {
        setRecentSearches(prevSearches => {
            const updatedSearches = [searchAddress, ...prevSearches.filter(s => s !== searchAddress)].slice(0, 5);
            return updatedSearches;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (suggestions.length > 0) {
            const { lat, lon } = suggestions[0];
            fetchWeather(lat, lon);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setAddress(suggestion.display_name);
        setSuggestions([]);
        fetchWeather(suggestion.lat, suggestion.lon);
    };

    const getWeatherIcon = (weatherMain) => {
        switch (weatherMain) {
            case 'Clear': return 'bi bi-sun';
            case 'Clouds': return 'bi bi-cloud';
            case 'Rain': return 'bi bi-cloud-rain';
            case 'Snow': return 'bi bi-snow';
            case 'Thunderstorm': return 'bi bi-lightning';
            default: return 'bi bi-cloud';
        }
    };

    const getBackgroundColor = (weatherMain) => {
        switch (weatherMain) {
            case 'Clear': return 'linear-gradient(to right, #ff7e5f, #feb47b)';
            case 'Clouds': return 'linear-gradient(to right, #bdc3c7, #2c3e50)';
            case 'Rain': return 'linear-gradient(to right, #3a7bd5, #3a6073)';
            case 'Snow': return 'linear-gradient(to right, #e6dada, #274046)';
            default: return 'linear-gradient(to right, #36d1dc, #5b86e5)';
        }
    };

    return (
        <StyledContainer bgColor={weather ? getBackgroundColor(weather.weather[0].main) : undefined}>
            <h1 className="text-center mb-4 text-white">Weather App</h1>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="addressInput">
                            <Form.Control
                                type="text"
                                placeholder="Enter address, city, or location"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </Form.Group>
                        {suggestions.length > 0 && (
                            <ListGroup className="mb-3">
                                {suggestions.map((suggestion, index) => (
                                    <ListGroup.Item key={index} action onClick={() => handleSuggestionClick(suggestion)}>
                                        {suggestion.display_name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Get Weather'}
                        </Button>
                    </Form>
                    <RecentSearches>
                        {recentSearches.map((search, index) => (
                            <RecentSearchButton key={index} variant="light" onClick={() => setAddress(search)}>
                                {search}
                            </RecentSearchButton>
                        ))}
                    </RecentSearches>

                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                    {weather && (
                        <WeatherCard className="mt-3">
                            <Card.Body>
                                <Card.Title className="text-center mb-4">
                                    {weather.name}, {weather.sys.country}
                                </Card.Title>
                                <Row className="align-items-center text-center">
                                    <Col>
                                        <WeatherIcon className={getWeatherIcon(weather.weather[0].main)} />
                                        <h2>{Math.round(weather.main.temp)}°C</h2>
                                        <p>{weather.weather[0].description}</p>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col>
                                        <p><strong>Feels like:</strong> {Math.round(weather.main.feels_like)}°C</p>
                                        <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
                                    </Col>
                                    <Col>
                                        <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
                                        <p><strong>Pressure:</strong> {weather.main.pressure} hPa</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </WeatherCard>
                    )}
                </Col>
            </Row>
        </StyledContainer>
    );
};

export default WeatherApp;