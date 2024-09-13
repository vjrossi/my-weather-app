import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

const StyledContainer = styled(Container)`
  margin-top: 2rem;
`;

const WeatherIcon = styled.i`
  font-size: 3rem;
`;

const WeatherApp = () => {
    useEffect(() => {
        console.log('API Key:', API_KEY);
    }, []);
    
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
    const API_KEY = "9a90a19b627e8512a82bee7d66a0b793";

    const fetchWeather = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            setWeather(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getWeatherIcon = (weatherMain) => {
        switch (weatherMain) {
            case 'Clear':
                return 'bi bi-sun';
            case 'Clouds':
                return 'bi bi-cloud';
            case 'Rain':
                return 'bi bi-cloud-rain';
            default:
                return 'bi bi-cloud';
        }
    };

    return (
        <StyledContainer>
            <h1 className="text-center mb-4">Weather App</h1>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form onSubmit={fetchWeather}>
                        <Form.Group className="mb-3" controlId="cityInput">
                            <Form.Control
                                type="text"
                                placeholder="Enter city name"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Loading...' : 'Get Weather'}
                        </Button>
                    </Form>

                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                    {weather && (
                        <Card className="mt-3">
                            <Card.Body>
                                <Card.Title>{weather.name}, {weather.sys.country}</Card.Title>
                                <Row className="align-items-center">
                                    <Col>
                                        <h2>{Math.round(weather.main.temp)}°C</h2>
                                        <p>{weather.weather[0].description}</p>
                                    </Col>
                                    <Col className="text-end">
                                        <WeatherIcon className={getWeatherIcon(weather.weather[0].main)} />
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col>
                                        <p>Humidity: {weather.main.humidity}%</p>
                                        <p>Wind Speed: {weather.wind.speed} m/s</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </StyledContainer>
    );
};

export default WeatherApp;