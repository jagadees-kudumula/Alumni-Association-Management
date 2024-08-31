import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

function LoginStudent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
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

    const handleAlumniSignUpClick = () => {
        navigate('/signup/student'); // Navigate to the home page
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
                navigate('/dashboard/student');
            } else {
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
        // Add a unique identifier class to the outermost div or relevant parent container
        <div className="login-page">
        <nav className="login-navbar"> 
            <div className="login-navbar-brand">MyApp</div>
            <div className="login-navbar-links">
                <button  onClick={handleAlumniSignUpClick} class="btn btn-primary">SignUp</button>
                <button  onClick={handleHomeClick} class="btn btn-primary">Home</button>
                <button  onClick={handleAboutClick} class="btn btn-primary">About</button>
                <button  onClick={handleContactClick} class="btn btn-primary">Contact</button>
                <button  onClick={handleHelpClick} class="btn btn-primary">Help</button>
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
