import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Index from './components/Index/Index';
import SignupStudent from './components/Signup/SignupStudent';
import SignupAlumni from './components/Signup/SignupAlumni';
import LoginStudent from './components/Login/LoginStudent';
import LoginAlumni from './components/Login/LoginAlumni';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import StudentDashboard from './components/StudentDashboard/StudentDashboard';
import AlumniDashboard from './components/AlumniDashboard/AlumniDashboard';
import ChatComponent from './components/ChatComponent/ChatComponent';
import DonationsPage from './components/DonationsPage/DonationsPage';
import StudentProfile from './components/StudentProfile/StudentProfile';
import Contact from './components/Contact/Contact'
import { useEffect } from 'react';
import axios from 'axios';


const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
const PING_INTERVAL = 5000;  // 5 seconds

function App() {
    useEffect(() => {
        const pingServer = async () => {
            try {
                await axios.get('/ping');  // Server is running
                console.log('Server is running');
            } catch (error) {
                console.error('Server is down', error);
                localStorage.clear();  // Clear local storage when server is unreachable

            }
        };

        const refreshStudentToken = () => {
            const studentToken = localStorage.getItem('student-refresh-token');
            if (studentToken) {
                axios.post('/student_refresh', {}, {
                    headers: {
                        'Authorization': `Bearer ${studentToken}`
                    }
                })
                .then(response => {
                    localStorage.setItem('student-token', response.data.access_token);
                })
                .catch(error => {
                    console.error('Student token refresh failed', error);
                });
            }
        };

        const refreshAlumniToken = () => {
            const alumniToken = localStorage.getItem('alumni-refresh-token');
            if (alumniToken) {
                axios.post('/alumni_refresh', {}, {
                    headers: {
                        'Authorization': `Bearer ${alumniToken}`
                    }
                })
                .then(response => {
                    localStorage.setItem('alumni-token', response.data.access_token);
                })
                .catch(error => {
                    console.error('Alumni token refresh failed', error);
                });
            }
        };

        // Refresh tokens immediately on load
        refreshStudentToken();
        refreshAlumniToken();

        // Set interval to refresh tokens every 10 minutes
        const studentIntervalId = setInterval(refreshStudentToken, TOKEN_REFRESH_INTERVAL);
        const alumniIntervalId = setInterval(refreshAlumniToken, TOKEN_REFRESH_INTERVAL);

        // Ping the server every 5 seconds
        const pingIntervalId = setInterval(pingServer, PING_INTERVAL);

        // Clean up intervals on component unmount
        return () => {
            clearInterval(studentIntervalId);
            clearInterval(alumniIntervalId);
            clearInterval(pingIntervalId);
        };
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/signup/student" element={<SignupStudent />} />
                    <Route path="/signup/alumni" element={<SignupAlumni />} />
                    <Route path="/login/student" element={<LoginStudent />} />
                    <Route path="/login/alumni" element={<LoginAlumni />} />
                    <Route path="/forgot-password/:userType" element={<ForgotPassword />} />
                    <Route path="/dashboard/student" element={<StudentDashboard />}/>
                    <Route path="/dashboard/alumni" element={<AlumniDashboard />} />
                    <Route path="/chat" element={<ChatComponent />} />
                    <Route path="/donate" element={<DonationsPage />} />
                    <Route path='/student/profile' element={<StudentProfile />}/>
                    <Route path='/contact' element={<Contact />}/>
                    {/* Add additional routes here */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
