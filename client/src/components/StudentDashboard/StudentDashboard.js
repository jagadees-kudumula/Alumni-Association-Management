import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const StudentDashboard = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const hasEffectRun = useRef(false);

  const handleLogout = () => {
    localStorage.removeItem('student-token'); // Remove JWT token from localStorage
    localStorage.removeItem('student-refresh-token');
    navigate('/', { replace: true }); // Redirect to alumni login page
  };

  const handleHome = () => {
    navigate('/', { replace: true }); // Redirect to alumni login page
  };

  const handleProfile = () => {
    navigate('/student/profile', {replace: true});
  };

  useEffect(() => {
    if (hasEffectRun.current) return;
    hasEffectRun.current = true;
    const fetchDashboardData = async () => {
      try { 
        const token = localStorage.getItem('student-token');
        console.log(token);
        const response = await axios.get('/student_dashboard', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(response.data.message);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError('Access forbidden: not a student');
          navigate('/login/student');  // Redirect to login or another page
        }  else if (error.response && error.response.status === 422) {
          setError('Access forbidden: UnAuthorized Access');
          setTimeout(() => navigate('/'), 3000);
        }
        else {
            // Network error or server down
            setError('Server is down, redirecting to index page.');
            console.log(error);
            // Redirect to index page after handling error
            setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds for user feedback
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>{message}</p>
      <p><a onClick={handleLogout}>LogOut</a></p>
      <p><a onClick={handleHome}>Home</a></p>
      <p><a onClick={handleProfile}>Profile</a></p>
    </div>
  );
};

export default StudentDashboard;
