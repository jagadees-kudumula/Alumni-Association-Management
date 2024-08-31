import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUserTie } from '@fortawesome/free-solid-svg-icons';
import './Index.css';
import { useNavigate } from 'react-router-dom';

function Index() {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/'); // Navigate to the home page
    };

    const handleContactClick = () => {
        navigate('/contact'); // Navigate to the home page
    };

    const handleAboutClick = () => {
        navigate('/about'); // Navigate to the home page
    };

    const handleHelpClick = () => {
        navigate('/help'); // Navigate to the home page
    };

    return (
        <div className="index-page">
            {/* Navbar */}
            <nav className="navbar">
                <a className="navbar-brand" href="/">Alumni Association</a>
                <div className="navbar-links">
                    <button  onClick={handleHomeClick} class="btn btn-primary">Home</button>
                    <button  onClick={handleAboutClick} class="btn btn-primary">About</button>
                    <button  onClick={handleContactClick} class="btn btn-primary">Contact</button>
                    <button  onClick={handleHelpClick} class="btn btn-primary">Help</button>
                </div>
            </nav>

            {/* Main Content */}
            <header className="header">
                <h1 className="display-4">Welcome to the Alumni Association Platform</h1>
                <p className="lead">Select your role to get started</p>
            </header>

            <main className="main-content">
                <div className="option-cards">
                    {/* Student Option */}
                    <div className="option-card">
                        <FontAwesomeIcon icon={faUserGraduate} className="icon" />
                        <h2 className="card-title">Student</h2>
                        <p className="card-text">Choose this if you are a current student.</p>
                        <div className="button-group">
                            <Link to="/signup/student" className="btn btn-primary">Sign Up</Link>
                            <Link to="/login/student" className="btn btn-outline-primary">Login</Link>
                        </div>
                    </div>

                    {/* Alumni Option */}
                    <div className="option-card">
                        <FontAwesomeIcon icon={faUserTie} className="icon" />
                        <h2 className="card-title">Alumni</h2>
                        <p className="card-text">Choose this if you are an alumnus.</p>
                        <div className="button-group">
                            <Link to="/signup/alumni" className="btn btn-secondary">Sign Up</Link>
                            <Link to="/login/alumni" className="btn btn-outline-secondary">Login</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Index;
