import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <div className="gif-container">
                {/* GIF and logo here */}
            </div>
            <p>About statement here</p>
            <div className="button-container">
                <Link to="/quickestpath"><button>Go to Page 1</button></Link>
                <Link to="/standbypredictor"><button>Go to Page 2</button></Link>
                <Link to="/dashboard"><button>Go to Page 3</button></Link>
            </div>
        </div>
    );
}

export default Home;
