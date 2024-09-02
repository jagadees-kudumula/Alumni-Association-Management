import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUserTie, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';

const SOCKET_SERVER_URL = 'http://localhost:5000';

function LoginStudent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    function isTokenExpired(token) {
        try {
          const decoded = jwtDecode(token);
          const now = Math.floor(Date.now() / 1000);
          return decoded.exp < now;
        } catch (e) {
          console.error('Invalid token', e);
          return true;
        }
      }

    const handleToggleClick = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };


    // Prevent access to login page if already logged in
    useEffect(() => {
        const token = localStorage.getItem('student-token'); 
        // If a user is already logged in, redirect them to the Student dashboard
        if (token && !isTokenExpired(token)) {
            console.log(token);
            navigate('/dashboard/student', { replace: true });
        }

        // Add event listener for popstate to prevent back navigation
        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', () => {
            window.history.pushState(null, null, window.location.href);
            navigate('/', { replace: true });
        });

        return () => {
            window.removeEventListener('popstate', () => {
                navigate('/dashboard/student', { replace: true });
            });
        };
    }, [navigate]);

    const handleHomeClick = () => {
        navigate('/'); // Navigate to the home page
    };

    const handleContactClick = () => {
        navigate('/contact'); // Navigate to the contact page
    };

    const handleAboutClick = () => {
        navigate('/about'); // Navigate to the about page
    };

    const handleHelpClick = () => {
        navigate('/help'); // Navigate to the help page
    };

    const handleStudentSignUpClick = () => {
        navigate('/signup/student'); // Navigate to the student signup page
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/login/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                // console.log(data)
                
                localStorage.setItem('student-token', data.access_token); // Store JWT token
                navigate('/dashboard/student', { replace: true });

                // Prevent back navigation to the login page
                window.history.pushState(null, null, window.location.href);
                window.addEventListener('popstate', () => {
                    navigate('/', { replace: true });});
                
                
            } else{
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }

        
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password/student');
    };

    return (
        <div className="login-page">
            <nav className="indexnavbar">
                <a className="indexnavbar-brand" href="/">Alumni Association</a>
                <div className="indexnavbar-links">
                    {/* Hamburger Menu for Mobile */}
                    <button className="mobile-menu-icon" onClick={handleToggleClick}>
                        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
                        {console.log("Printed")}
                    </button>

                    {/* Regular links for desktop */}
                    <div className="desktop-navbar-links">
                        <button onClick={handleStudentSignUpClick} className="btn btn-primary">SignUp</button>
                        <button onClick={handleHomeClick} className="btn btn-primary">Home</button>
                        <button onClick={handleAboutClick} className="btn btn-primary">About</button>
                        <button onClick={handleContactClick} className="btn btn-primary">Contact</button>
                        <button onClick={handleHelpClick} className="btn btn-primary">Help</button>
                    </div>

                    {/* Dropdown menu for mobile */}
                    {isMobileMenuOpen && (
                        <div className="mobile-navbar-dropdown">
                            <button onClick={handleStudentSignUpClick} className="btn btn-primary">SignUp</button>
                            <button onClick={handleHomeClick} className="btn btn-primary">Home</button>
                            <button onClick={handleAboutClick} className="btn btn-primary">About</button>
                            <button onClick={handleContactClick} className="btn btn-primary">Contact</button>
                            <button onClick={handleHelpClick} className="btn btn-primary">Help</button>
                        </div>
                    )}
                </div>
            </nav>
            <div className="login-container">
                <div className="card login-card">
                    <h2 className="text-center mb-4">Student Login</h2>
                    {error && <div className="login-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="login-field">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-field">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    <div className="forgot-password">
                        <button className="forgot-password-button" onClick={handleForgotPassword}>
                            Forgot Password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginStudent;
