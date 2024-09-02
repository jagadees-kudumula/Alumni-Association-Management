import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUserTie, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Index.css';
import { useNavigate } from 'react-router-dom';

function Index() {
    const navigate = useNavigate();

    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleToggleClick = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const handlePopState = (event) => {
            event.preventDefault();
            navigate('/', { replace: true }); // Replace with your index page route
        };

        // Listen for back button press
        window.addEventListener('popstate', handlePopState);

        return () => {
            // Clean up the event listener when the component is unmounted
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

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
            <nav className="indexnavbar">
                <a className="indexnavbar-brand" href="/">Alumni Association</a>
                <div className="indexnavbar-links">
                    {/* Hamburger Menu for Mobile */}
                    <button className="mobile-menu-icon" onClick={handleToggleClick}>
                        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
                    </button>

                    {/* Regular links for desktop */}
                    <div className="desktop-navbar-links">
                        <button onClick={handleHomeClick} className="btn btn-primary">Home</button>
                        <button onClick={handleAboutClick} className="btn btn-primary">About</button>
                        <button onClick={handleContactClick} className="btn btn-primary">Contact</button>
                        <button onClick={handleHelpClick} className="btn btn-primary">Help</button>
                    </div>

                    {/* Dropdown menu for mobile */}
                    {isMobileMenuOpen && (
                        <div className="mobile-navbar-dropdown">
                            <button onClick={handleHomeClick} className="btn btn-primary">Home</button>
                            <button onClick={handleAboutClick} className="btn btn-primary">About</button>
                            <button onClick={handleContactClick} className="btn btn-primary">Contact</button>
                            <button onClick={handleHelpClick} className="btn btn-primary">Help</button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <header className="indexheader">
                <h1 className="indexdisplay-4">Welcome to the Alumni Association Platform</h1>
                <p className="indexlead">Select your role to get started</p>
            </header>

            <main className="indexmain-content">
                <div className="indexoption-cards">
                    {/* Student Option */}
                    <div className="indexoption-card">
                        <FontAwesomeIcon icon={faUserGraduate} className="indexicon" />
                        <h2 className="indexcard-title">Student</h2>
                        <p className="indexcard-text">Choose this if you are a current student.</p>
                        <div className="indexbutton-group">
                            <Link to="/signup/student" className="indexbtn indexbtn-primary">Sign Up</Link>
                            <Link to="/login/student" className="indexbtn indexbtn-outline-primary">Login</Link>
                        </div>
                    </div>

                    {/* Alumni Option */}
                    <div className="indexoption-card">
                        <FontAwesomeIcon icon={faUserTie} className="indexicon" />
                        <h2 className="indexcard-title">Alumni</h2>
                        <p className="indexcard-text">Choose this if you are an alumnus.</p>
                        <div className="indexbutton-group">
                            <Link to="/signup/alumni" className="indexbtn indexbtn-secondary">Sign Up</Link>
                            <Link to="/login/alumni" className="indexbtn indexbtn-outline-secondary">Login</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Index;
