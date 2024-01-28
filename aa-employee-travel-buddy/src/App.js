import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Startup from './pages/Startup';
import Home from './pages/Home';
import QuickestPath from './pages/QuickestPath';
import Dashboard from './pages/Dashboard';
import StandbyPredictor from './pages/StandbyPredictor';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Startup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/quickestpath" element={<QuickestPath/>} />
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/standbypredictor" element={<StandbyPredictor/>}/>
            </Routes>
        </Router>
    );
}

export default App;
