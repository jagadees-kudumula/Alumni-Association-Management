import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaBook, FaClipboard, FaCog,FaBars, FaAlignRight} from 'react-icons/fa'; // Importing icons
import './StudentDashboard.css'; // Adjust the path for CSS
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  // State to manage sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();

  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };


  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex">
      {/* Toggle Button: Always visible to show sidebar */}
      
      <button
        onClick={toggleSidebar}
        className="btn btn-primary position-fixed"
        style={{ top: '40px', left: '10px', zIndex: 1000 }}
      >
        Menu
      </button>

      {/* Sidebar: Hidden initially, shown when button is clicked */}
      <div
        className={`sidebar bg-dark text-white ${isSidebarVisible ? 'visible' : ''}`}
        style={{
          width: isSidebarVisible ? '250px' : '0',
          transition: 'width 0.3s',
          overflowX: 'hidden', // Ensures sidebar content is hidden when collapsed
        }}
      >
        <div className="sidebar-sticky p-3">
          <h4 className="text-center mb-4">Student Portal</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a className="nav-link text-white d-flex align-items-center" href="#profile">
                <FaUser className="me-2" /> Profile
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-white d-flex align-items-center" href="#courses">
                <FaBook className="me-2" /> Job Openings
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-white d-flex align-items-center" href="#grades">
                <FaClipboard className="me-2" /> Success Stories of Alumni
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white d-flex align-items-center" href="#settings">
                <FaCog className="me-2" /> Events
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content: Adjusts layout based on sidebar visibility */}
      <main
        className="content flex-grow-1"
        style={{
          marginLeft: isSidebarVisible ? '250px' : '0',
          transition: 'margin-left 0.3s', // Smooth transition for main content shift
          padding: '20px', // Adds space around the main content
        }}
      >
        
          
        <header className="dashboard-header py-4 mb-4 border-bottom d-flex justify-content-between align-items-center">
  <div className="flex-grow-1 text-center"> {/* Centering the title */}
    <h1 className="h3 text-primary mb-0">Student Dashboard</h1>
  </div>
         
          <div className="ms-auto">
          <a onClick={handleLogout}><span className="badge bg-primary p-2  justify-content-right align-items-right ">LogOut</span></a>
          </div>
          </header>
          

     

        <div className="dashboard-content">
          <section className="dashboard-section">
            <h2 className="h4 mb-4 text-secondary">
              <u>Overview</u>
            </h2>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card border-0 shadow-sm h-100 dashboard-card">
                  <div className="card-body d-flex flex-column align-items-start">
                    <h5 className="card-title text-primary d-flex align-items-center">
                      <FaBook className="me-2" /> Recent Courses
                    </h5>
                    <p className="card-text">You have 3 new courses to review.</p>
                    <a href="#courses" className="stretched-link"></a>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card border-0 shadow-sm h-100 dashboard-card">
                  <div className="card-body d-flex flex-column align-items-start">
                    <h5 className="card-title text-success d-flex align-items-center">
                      <FaClipboard className="me-2" /> Upcoming Exams
                    </h5>
                    <p className="card-text">2 exams scheduled for this week.</p>
                    <a href="#exams" className="stretched-link"></a>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card border-0 shadow-sm h-100 dashboard-card">
                  <div className="card-body d-flex flex-column align-items-start">
                    <h5 className="card-title text-danger d-flex align-items-center">
                      <FaUser className="me-2" /> Notifications
                    </h5>
                    <p className="card-text">You have 5 unread notifications.</p>
                    <a href="#notifications" className="stretched-link"></a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
