import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Import the CSS file

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('student');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    user_type: userType,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setSuccess(data.message);
                setError(null);
                // Redirect to login page after successful signup
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message);
                setSuccess(null);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };
    

    return (
        <div className="signup-container">
            <h2 className="signup-header">Sign Up</h2>
            {error && <p className="signup-error">{error}</p>}
            {success && <p className="signup-success">{success}</p>}
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="signup-field">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="userType">User Type:</label>
                    <select
                        id="userType"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        required
                    >
                        <option value="student">Student</option>
                        <option value="alumni">Alumni</option>
                    </select>
                </div>
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
        </div>
    );
}

export default Signup;
