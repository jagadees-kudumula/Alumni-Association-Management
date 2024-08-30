import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // Import CSS for styling

function Index() {
    return (
        <div className="index-container">
            <h1>Welcome to Our Platform</h1>
            <p>Select your role to proceed:</p>
            <div className="button-group">
                <Link to="/signup/student">
                    <button className="btn">Sign Up as Student</button>
                </Link>
                <Link to="/signup/alumni">
                    <button className="btn">Sign Up as Alumni</button>
                </Link>
                <Link to="/login/student">
                    <button className="btn">Login as Student</button>
                </Link>
                <Link to="/login/alumni">
                    <button className="btn">Login as Alumni</button>
                </Link>
            </div>
        </div>
    );
}

export default Index;
