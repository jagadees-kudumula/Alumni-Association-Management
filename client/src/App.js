import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './LoginIndex';
import SignupStudent from './SignupStudent';
import SignupAlumni from './SignupAlumni';
import LoginStudent from './LoginStudent';
import LoginAlumni from './LoginAlumni';
import ForgotPassword from './ForgotPassword';
import StudentDashboard from './StudentDashboard';
import AlumniDashboard from './AlumniDashboard';

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
                    {/* Add additional routes here */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
