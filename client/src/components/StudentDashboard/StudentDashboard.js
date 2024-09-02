import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const StudentDashboard = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('student-token'); // Remove JWT token from localStorage
    navigate('/', { replace: true }); // Redirect to alumni login page
  };

  const handleHome = () => {
    navigate('/', { replace: true }); // Redirect to alumni login page
  };

  const handleProfile = () => {
    navigate('/student/profile', {replace: true});
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try { 
        const token = localStorage.getItem('student-token');
        const response = await axios.get('/student_dashboard', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setMessage(response.data.message);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError('Access forbidden: not a student');
          navigate('/login/student');  // Redirect to login or another page
        } else {
          console.log(error);
          setError('An error occurred while fetching the dashboard data.');
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
