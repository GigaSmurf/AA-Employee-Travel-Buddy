// QuickestPath.js

import React, { useState } from 'react';
import '../css/QuickestPath.css';

function QuickestPath() {
  const [date, setDate] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      const formattedDate = date.replaceAll('/', '-');
      const apiUrl = `https://aaflightenginedb-5c259d62e9ab.herokuapp.com/api/get-shortest-path?date=${formattedDate}&origin=${origin}&destination=${destination}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      console.log('API response:', data); // Add this line for debugging
  
      setResults(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="quickest-path-container">
        <div className="left">
            <h1>Find the Quickest Path</h1>
        </div>
        <div className="right">
            <form onSubmit={handleSubmit}>
                <label>
                    Date:
                    <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="yyyy-mm-dd" />
                </label>
                <br />
                <label>
                    Origin Airport:
                    <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                </label>
                <br />
                <label>
                    Destination Airport:
                    <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
                        {isSubmitted && (
                <div className="expected-output">
                    <h2>Expected Output:</h2>
                    <pre>
          {JSON.stringify({
            "shortest_path": ["LAX", "SFO", "BWI"],
            "flight_numbers": ["9016", "2803"],
            "standby_seats": ["1", "1"]
          }, null, 2)} {/* Pretty print the object */}
        </pre>
                    <p>Traveling on standby can be unpredictable for employees, often leading to situations where they arrive for a flight only to discover it's fully booked. Our application alleviates this stress by scanning available flights and calculating alternative routes. It helps employees find the most efficient way to reach their destination, even when their original plans fall through. This tool is designed to make standby travel more manageable and less stressful, ensuring employees have access to the best possible travel options at their fingertips.</p>
                    <p>By implementing an A* Algorithm, this feature of our application finds the shortest path from your origin to your destination only using standby flights.</p>
                </div>
            )}
        </div>
    </div>
);
}



export default QuickestPath;