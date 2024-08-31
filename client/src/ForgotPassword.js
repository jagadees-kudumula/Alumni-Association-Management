import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

function ForgotPassword() {
    const { userType } = useParams(); // Get the userType from the route
    const [emailOrMobile, setEmailOrMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Enter email/mobile, 2: Enter OTP and new password
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // State to handle loading
    const navigate = useNavigate();

    if (!userType) {
        return <div>Error: User type is undefined</div>;
    }

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setLoading(true); // Show loading spinner

        try {
            const response = await fetch(`/forgot-password/${userType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email_or_mobile: emailOrMobile,
                    username,
                 }),
            });
            console.log(userType)
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setStep(2);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const response = await fetch(`/reset-password/${userType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email_or_mobile: emailOrMobile,
                    otp: otp,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                    username,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                navigate(`/login/${userType}`)
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            <h4>Forgot Password ({userType})</h4>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {message && <div className="alert alert-success">{message}</div>}
                            {loading && (
                                <div className="text-center mb-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                            {step === 1 ? (
                                <form onSubmit={handleRequestOTP}>
                                    <div className="form-group">
                                        <label htmlFor="username">Username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            className="form-control"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="emailOrMobile">Email</label>
                                        <input
                                            type="text"
                                            id="emailOrMobile"
                                            className="form-control"
                                            value={emailOrMobile}
                                            onChange={(e) => setEmailOrMobile(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block mt-4">
                                        Request OTP
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleResetPassword}>
                                    <div className="form-group">
                                        <label htmlFor="otp">OTP</label>
                                        <input
                                            type="text"
                                            id="otp"
                                            className="form-control"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="newPassword">New Password</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block mt-4">
                                        Reset Password
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
