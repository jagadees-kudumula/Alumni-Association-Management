import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
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
                    <Route path="/dashboard/student" element={<StudentDashboard />} />
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
