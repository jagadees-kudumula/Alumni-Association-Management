import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUserTie, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';

function LoginAlumni() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Prevent access to login page if already logged in
    useEffect(() => {
        const token = localStorage.getItem('alumni-token'); 
        // If a user is already logged in, redirect them to the alumni dashboard
        if (token) {
            navigate('/dashboard/alumni', { replace: true });
        }

        // Add event listener for popstate to prevent back navigation
        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', () => {
            window.history.pushState(null, null, window.location.href);
            navigate('/', { replace: true });
        });
  

        return () => {
            window.removeEventListener('popstate', () => {
                navigate('/dashboard/alumni', { replace: true });
            });
        };
    }, [navigate]);

    const handleToggleClick = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };


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

    const handleAlumniSignUpClick = () => {
        navigate('/signup/alumni'); // Navigate to the alumni sign-up page
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/login/alumni', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                // console.log(data)
                
                localStorage.setItem('alumni-token', data.access_token); // Store JWT token
                localStorage.setItem('alumni-refresh-token', data.refresh_token);  // Store refresh token
                navigate('/dashboard/alumni', { replace: true });

                // Prevent back navigation to the login page
                window.history.pushState(null, null, window.location.href);
                window.addEventListener('popstate', () => {
                    navigate('/', { replace: true });});
                
                
            } else{
                setError(data.message);
            }
        } catch (error) {
            // Network error or server down
            setError('Server is down, redirecting to index page.');
            // Redirect to index page after handling error
            setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds for user feedback
            console.log(error);
        }
       
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password/alumni');  // Navigate to the forgot password page
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
                        <button onClick={handleAlumniSignUpClick} className="btn btn-primary">SignUp</button>
                        <button onClick={handleHomeClick} className="btn btn-primary">Home</button>
                        <button onClick={handleAboutClick} className="btn btn-primary">About</button>
                        <button onClick={handleContactClick} className="btn btn-primary">Contact</button>
                        <button onClick={handleHelpClick} className="btn btn-primary">Help</button>
                    </div>

                    {/* Dropdown menu for mobile */}
                    {isMobileMenuOpen && (
                        <div className="mobile-navbar-dropdown">
                            <button onClick={handleAlumniSignUpClick} className="btn btn-primary">SignUp</button>
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
                    <h2 className="text-center mb-4">Alumni Login</h2>
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

export default LoginAlumni;
