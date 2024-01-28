// Gabe
import './StandbyPredictor.css'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function StandbyPredictor() {

    const [formData, setFormData] = useState({
        date: '',
        origin: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
    });


    const [randomNumber, setRandomNumber] = useState(null);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
    };

    const generateRandomNumber = () => {
        // Simple bias: more chances to get numbers closer to 0
        const biasFactor = Math.random() * Math.random();
        return Math.floor(biasFactor * 24);
      };


      const handleSubmit = (e) => {
        e.preventDefault();
        const randomNumber = generateRandomNumber();
        setRandomNumber(randomNumber);
      };



    return <div className='Main'>

        <h1 className='info'>Please fill out the below fields to of your desired flight to see what our analytics show will be available</h1>
        <form onSubmit={handleSubmit}>
        <div className='Form Background'>
            
            <div className='Form'>
            
            <label>Date</label>
            <br/>
            
            <input type="date"></input>
            <br/>
            <label for="origin">Choose Airport of Origin:</label>
            <br/>
            <select id="origin" name="origin">
                <option value="DFW">Dallas/Fort Worth</option>
                <option value="JFK">New York City</option>
                <option value="LAX">Los Angeles</option>
                <option value="ORD">Chicago</option>
                <option value="GSO">Gree nsboro</option>
                <option value="ATL">Atlanta</option>
                <option value="DEN">Denver</option>
                <option value="CLT">Charlette</option>
                <option value="ORD">Chicago</option>
                <option value="PHX">Phoenix</option>
                <option value="MCO">Orlando</option>
                <option value="SEA">Seattle</option>
                <option value="MIA">Miami</option>
                <option value="IAH">Houston</option>
                <option value="FLL">Fort Lauderdale</option>
                <option value="BWI">Baltimore</option>
                <option value="SFO">San Francisco</option>
                <option value="MSP">Minneapolis</option>
                <option value="DTW">Detroit</option>
                <option value="BOS">Boston</option>
                <option value="TPA">Tampa</option>
                <option value="SLC">Salt Lake City</option>
                <option value="SAN">San Diego</option>
                <option value="PHL">Philadelphia</option>
            </select>

            <br/>
            <label for="dest">Choose Airport Destination:</label>
            <br/>
            <select id="dest" name="dest">
                <option value="DFW">Dallas/Fort Worth</option>
                <option value="JFK">New York City</option>
                <option value="LAX">Los Angeles</option>
                <option value="ORD">Chicago</option>
                <option value="GSO">Greensboro</option>
                <option value="ATL">Atlanta</option>
                <option value="DEN">Denver</option>
                <option value="CLT">Charlette</option>
                <option value="ORD">Chicago</option>
                <option value="PHX">Phoenix</option>
                <option value="MCO">Orlando</option>
                <option value="SEA">Seattle</option>
                <option value="MIA">Miami</option>
                <option value="IAH">Houston</option>
                <option value="FLL">Fort Lauderdale</option>
                <option value="BWI">Baltimore</option>
                <option value="SFO">San Francisco</option>
                <option value="MSP">Minneapolis</option>
                <option value="DTW">Detroit</option>
                <option value="BOS">Boston</option>
                <option value="TPA">Tampa</option>
                <option value="SLC">Salt Lake City</option>
                <option value="SAN">San Diego</option>
                <option value="PHL">Philadelphia</option>
            </select>

            <br/>
            <label>Time of Departure </label>
            
            <br/><input type="time"></input>
            <br/>
            <label>Time of Arrival</label>
            
            <br/><input type="time"></input>
            <br/>
            <button>See Projected Availability</button>
            
        </div>
        
        </div>
        </form>
        <br/>   
        <br/>

        {randomNumber !== null && (
        <div>
          <p>Projected number of seats on flight: {randomNumber}</p>
        </div>
      )}
    

    </div>;
}

export default StandbyPredictor;
