import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Import the CSS file
import { faUserGraduate, faUserTie, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function SignupStudent() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [batch, setBatch] = useState('');
    const [branch, setBranch] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [joiningYear, setJoiningYear] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [collegeId, setCollegeId] = useState(null);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const alertRef = useRef(false); 

    useEffect(() => {
        if (alertRef.current) return; { // Check if the alert has already been shown
            const studentToken = localStorage.getItem('student-token');

           if (studentToken) {
                alert('You are already logged in as an Student!');
                alertRef.current = true; // Mark alert as shown
                navigate('/dashboard/student');  // Redirect to alumni dashboard
            }
        }
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

    const handleStudentLoginClick = () => {
        navigate('/login/student'); // Navigate to the student login page
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/signup/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    batch,
                    branch,
                    email,
                    mobile,
                    username,
                    password,
                    joining_year: joiningYear,
                    confirm_password: confirmPassword,
                    college_id: collegeId
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setError(null);
                window.alert('Sign up successful! Redirecting to login page...');
                setTimeout(() => navigate('/login/student'), 800); // Redirect to login after 0.8 seconds
            } else {
                window.alert(`Error: ${data.message}`);
                setError(data.message);
                setSuccess(null);
            }
        } catch (error) {
            window.alert('An error occurred. Please try again.');
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="signup-page">
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
                        <button onClick={handleStudentLoginClick} className="btn btn-primary">LogIn</button>
                        <button onClick={handleHomeClick} className="btn btn-primary">Home</button>
                        <button onClick={handleAboutClick} className="btn btn-primary">About</button>
                        <button onClick={handleContactClick} className="btn btn-primary">Contact</button>
                        <button onClick={handleHelpClick} className="btn btn-primary">Help</button>
                    </div>

                    {/* Dropdown menu for mobile */}
                    {isMobileMenuOpen && (
                        <div className="mobile-navbar-dropdown">
                            <button onClick={handleStudentLoginClick} className="btn btn-primary">LogIn</button>
                            <button onClick={handleHomeClick} className="btn btn-primary">Home</button>
                            <button onClick={handleAboutClick} className="btn btn-primary">About</button>
                            <button onClick={handleContactClick} className="btn btn-primary">Contact</button>
                            <button onClick={handleHelpClick} className="btn btn-primary">Help</button>
                        </div>
                    )}
                </div>
            </nav>
            <div className="signup-form-container">
                <div className="signup-form-card">
                    <h2 className="signup-form-title">Student Sign Up</h2>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="firstName"><FontAwesomeIcon icon={faUser} /> First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="lastName"><FontAwesomeIcon icon={faUser} /> Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="batch"><FontAwesomeIcon icon={faCalendar} /> Batch</label>
                            <input
                                type="text"
                                id="batch"
                                placeholder="Enter your batch"
                                value={batch}
                                onChange={(e) => setBatch(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="branch"><FontAwesomeIcon icon={faCalendar} /> Branch</label>
                            <input
                                type="text"
                                id="branch"
                                placeholder="Enter your branch"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="collegeId"><FontAwesomeIcon icon={faCalendar} /> College ID</label>
                            <input
                                type="text"
                                id="collegeId"
                                placeholder="Enter your College Id"
                                value={collegeId}
                                onChange={(e) => setCollegeId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="joiningYear"><FontAwesomeIcon icon={faCalendar} /> Joining Year</label>
                            <input
                                type="text"
                                id="joiningYear"
                                placeholder="Enter your joining year"
                                value={joiningYear}
                                onChange={(e) => setJoiningYear(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="email"><FontAwesomeIcon icon={faEnvelope} /> Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="mobile"><FontAwesomeIcon icon={faPhone} /> Mobile Number</label>
                            <input
                                type="text"
                                id="mobile"
                                placeholder="Enter your mobile number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="username"><FontAwesomeIcon icon={faUser} /> Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="password"><FontAwesomeIcon icon={faLock} /> Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Choose a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="confirmPassword"><FontAwesomeIcon icon={faLock} /> Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignupStudent;
