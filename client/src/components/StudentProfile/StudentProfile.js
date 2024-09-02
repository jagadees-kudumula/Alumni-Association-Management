import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "./StudentProfile.css";
import defaultProfilePic from "./profile.jpeg"; // Default image
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faSave, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const StudentProfile = () => {
  // State management
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [name, setName] = useState("John Doe");
  const [about, setAbout] = useState("I am a passionate computer science student with a keen interest in software development, data science, and AI. I love coding and constantly strive to learn new technologies.");
  const [education, setEducation] = useState("Bachelor of Science in Computer Science (2020 - 2024)");
  const [experiences, setExperiences] = useState([{
    company: "ABC Corp",
    role: "Software Intern",
    duration: "June 2023 - August 2023",
    description: "Developed a web application using React.js and Node.js that improved the company’s internal tool efficiency by 20%."
  }]);
  const [skills, setSkills] = useState(["JavaScript", "React.js", "Python", "Data Structures and Algorithms"]);
  const [location, setLocation] = useState("New York, NY");
  const [university, setUniversity] = useState("University of XYZ");
  const [showExperience, setShowExperience] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load from local storage
  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("profile")) || {};
    setName(storedProfile.name || "John Doe");
    setAbout(storedProfile.about || "I am a passionate computer science student with a keen interest in software development, data science, and AI. I love coding and constantly strive to learn new technologies.");
    setProfilePic(storedProfile.profilePic || defaultProfilePic);
    setEducation(storedProfile.education || "Bachelor of Science in Computer Science (2020 - 2024)");
    setExperiences(storedProfile.experiences || [{
      company: "ABC Corp",
      role: "Software Intern",
      duration: "June 2023 - August 2023",
      description: "Developed a web application using React.js and Node.js that improved the company’s internal tool efficiency by 20%."
    }]);
    setSkills(storedProfile.skills || ["JavaScript", "React.js", "Python", "Data Structures and Algorithms"]);
    setLocation(storedProfile.location || "New York, NY");
    setUniversity(storedProfile.university || "University of XYZ");
  }, []);

  // Save to local storage
  const saveProfileToLocalStorage = () => {
    const profile = {
      name,
      about,
      profilePic,
      education,
      experiences,
      skills,
      location,
      university
    };
    localStorage.setItem("profile", JSON.stringify(profile));
  };

  useEffect(() => {
    saveProfileToLocalStorage();
  }, [name, about, profilePic, education, experiences, skills, location, university]);

  // Handlers
  const toggleExperience = () => setShowExperience(!showExperience);
  const toggleEducation = () => setShowEducation(!showEducation);
  const toggleEditing = () => setIsEditing(!isEditing);

  const handleNameChange = (e) => setName(e.target.value);
  const handleAboutChange = (e) => setAbout(e.target.value);
  const handleEducationChange = (e) => setEducation(e.target.value);
  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = experiences.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updatedExperiences);
  };
  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleUniversityChange = (e) => setUniversity(e.target.value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfilePic(defaultProfilePic);
  };

  const saveChanges = () => {
    setIsEditing(false);
    saveProfileToLocalStorage(); // Save all changes to local storage
  };

  const addExperience = () => {
    const newExperience = {
      company: "",
      role: "",
      duration: "",
      description: ""
    };
    setExperiences([...experiences, newExperience]);
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-lg rounded border-primary">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-picture-container">
            <img
              src={profilePic || defaultProfilePic}
              alt="Profile"
              className="profile-picture"
            />
            <div className="profile-picture-buttons">
              <div className="edit-options">
                <span>+</span>
                <div className="options-dropdown">
                  <button onClick={() => document.getElementById("file-upload").click()}>Edit</button>
                  <button onClick={removeImage}>Remove</button>
                </div>
              </div>
              <input
                type="file"
                id="file-upload"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <div className="ms-4">
            {isEditing ? (
              <>
                <input type="text" className="form-control mb-2 border-info" value={name} onChange={handleNameChange} />
                <input type="text" className="form-control mb-2 border-info" value={university} onChange={handleUniversityChange} />
                <input type="text" className="form-control mb-2 border-info" value={location} onChange={handleLocationChange} />
              </>
            ) : (
              <>
                <h1 className="h3 text-primary">{name}</h1>
                <h2 className="h5 text-muted">{university}</h2>
                <p className="text-muted">Location: {location}</p>
              </>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="about-section card mt-4 p-3 bg-light text-dark">
          <h2>About</h2>
          {isEditing ? (
            <textarea className="form-control border-light bg-white text-dark" value={about} onChange={handleAboutChange} />
          ) : (
            <p>{about}</p>
          )}
        </div>

        {/* Education Section */}
        <div className="education-section card mt-4 p-3 bg-light text-dark">
          <h2 onClick={toggleEducation} className="interactive-heading">
            Education
          </h2>
          {showEducation && (
            <div className="education-item mt-2">
              {isEditing ? (
                <textarea className="form-control border-light bg-white text-dark" value={education} onChange={handleEducationChange} />
              ) : (
                <p>{education}</p>
              )}
            </div>
          )}
        </div>

        {/* Experience Section */}
        <div className="experience-section card mt-4 p-3 bg-light text-dark">
          <h2 onClick={toggleExperience} className="interactive-heading">
            Experience
          </h2>
          {showExperience && (
            <>
              {experiences.map((experience, index) => (
                <div key={index} className="experience-item mt-2">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        className="form-control mb-2 border-dark"
                        name="role"
                        value={experience.role}
                        onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control mb-2 border-dark"
                        name="company"
                        value={experience.company}
                        onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control mb-2 border-dark"
                        name="duration"
                        value={experience.duration}
                        onChange={(e) => handleExperienceChange(index, "duration", e.target.value)}
                      />
                      <textarea
                        className="form-control border-dark bg-white text-dark"
                        name="description"
                        value={experience.description}
                        onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <h4>{experience.role}</h4>
                      <h5>{experience.company}</h5>
                      <p className="text-muted">{experience.duration}</p>
                      <p>{experience.description}</p>
                    </>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  className="btn btn-outline-primary mt-2"
                  onClick={addExperience}
                >
                  <FontAwesomeIcon icon={faPlusCircle} /> Add Experience
                </button>
              )}
            </>
          )}
        </div>

        {/* Skills Section */}
        <div className="skills-section card mt-4 p-3 bg-light text-dark">
          <h2>Skills</h2>
          {isEditing ? (
            <textarea
              className="form-control border-dark bg-white text-dark"
              value={skills.join(", ")}
              onChange={(e) => setSkills(e.target.value.split(",").map(skill => skill.trim()))}
            />
          ) : (
            <p>{skills.join(", ")}</p>
          )}
        </div>

        {/* Edit/Save Button */}
        <div className="edit-button-container mt-4 d-flex justify-content-end">
          {isEditing ? (
            <button
              className="btn btn-outline-success"
              onClick={saveChanges}
            >
              <FontAwesomeIcon icon={faSave} /> Save
            </button>
          ) : (
            <button
              className="btn btn-outline-primary"
              onClick={toggleEditing}
            >
              <FontAwesomeIcon icon={faPencilAlt} /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
