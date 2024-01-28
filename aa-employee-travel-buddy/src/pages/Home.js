import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css'; // Ensure you have this CSS file in the same directory

function Home() {
    return (
        <div className="home-container">
            <div className="upper-half">
                <div className="gif-container">
                    <img src="/aal-american-airlines.gif" alt="Background" />
                </div>
                <div className="logo-and-about">
                    <img src="/AALogo.png" alt="Logo" className="logo" />
                    <p>American Airlines Travel Buddy: Enhancing employee travel with smart pathfinding, standby predictions, and real-time flight updates.</p>
                </div>
            </div>
            <div className="lower-half">
                <div className="button-container">
                    <Link to="/quickestpath">
                        <button>
                            Optimal Flight Pathfinder
                            <span className="button-description">
                                Explore the most efficient routes with our sophisticated A* pathfinding algorithm, ensuring seamless navigation through available flights.
                             </span>
                        </button>
                    </Link>
                    <Link to="/standbypredictor">
                        <button>
                            Standby Trend Analytics
                            <span className="button-description">Leverage predictive analytics to anticipate standby trends, powered by machine learning for accurate, data-driven insights into employee travel patterns.</span>
                        </button>
                    </Link>
                    <Link to="/dashboard">
                        <button>
                            Live Flight Dashboard
                            <span className="button-description">Stay informed with real-time updates on flight statuses, schedules, and more, ensuring you're always up-to-date with the latest flight information.</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
