import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import '../css/Dashboard.css'

const Dashboard = () => {
    const [airports, setAirports] = useState([]);
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        // Fetch airports data
        axios.get('https://aaflightenginedb-5c259d62e9ab.herokuapp.com/airports/all')
            .then(response => {
                setAirports(response.data);
            })
            .catch(error => {
                console.log('Error fetching airport data:', error);
            });

        // Fetch flights data for today
        const today = new Date().toISOString().split('T')[0];
        axios.get(`https://aaflightenginedb-5c259d62e9ab.herokuapp.com/flights?date=${today}`)
            .then(response => {
                setFlights(response.data.slice(0, 10)); // Get top 10 flights
            })
            .catch(error => {
                console.log('Error fetching flight data:', error);
            });
    }, []);

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="dashboard-container">
            <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {airports.map(airport => (
                    <Marker 
                        key={airport.code}
                        position={[airport.location.latitude, airport.location.longitude]}
                        icon={new L.Icon({ iconUrl: '/airportlogo.svg', iconSize: [25, 25] })}>
                        <Popup>
                            {airport.city} ({airport.code})
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <div className="flights-container">
                <h2>Flights for Today</h2>
                <ul>
                    {flights.map(flight => (
                        <li key={flight.flightNumber}>
                            <span>
                                <b>{flight.origin.code} to {flight.destination.code}</b> - Flight {flight.flightNumber}
            
                                <span className="departure-arrival-info">
                                    Departure: {formatTime(flight.departureTime)}, Arrival: {formatTime(flight.arrivalTime)}
                                </span>
                            </span>
                            <button className="book-button" onClick={() => alert('Booking not available yet.')}>Book</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
