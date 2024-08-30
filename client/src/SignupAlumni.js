import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Import CSS for styling

function SignupAlumni() {
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
    const [passoutYear, setPassoutYear] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/signup/alumni', {
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
                    passout_year: passoutYear,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setError(null);
                window.alert('Sign up successful! Redirecting to login page...');
                setTimeout(() => navigate('/login/alumni'), 2000); // Redirect to login after 2 seconds
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
        <div className="signup-background d-flex justify-content-center align-items-center">
            <div className="card p-3 signup-form-container">
                <h2 className="text-center mb-4">Alumni Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="batch">Batch</label>
                        <input
                            type="text"
                            className="form-control"
                            id="batch"
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="branch">Branch</label>
                        <input
                            type="text"
                            className="form-control"
                            id="branch"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="joiningYear">Joining Year</label>
                        <input
                            type="text"
                            className="form-control"
                            id="joiningYear"
                            value={joiningYear}
                            onChange={(e) => setJoiningYear(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passoutYear">PassOut Year</label>
                        <input
                            type="text"
                            className="form-control"
                            id="passoutYear"
                            value={passoutYear}
                            onChange={(e) => setPassoutYear(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mobile">Mobile Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="mobile"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                </form>
            </div>
        </div>
    );
}

export default SignupAlumni;
