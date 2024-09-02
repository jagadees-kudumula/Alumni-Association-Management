import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HelpUs.css';

const HelpUs = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [error, setError] = useState('');

    const handleQuestionSubmit = (e) => {
        e.preventDefault();
        if (currentQuestion.trim() === '') {
            setError('Please enter a question before submitting.');
        } else {
            setQuestions([...questions, currentQuestion]);
            setCurrentQuestion('');
            setError(''); // Clear any existing error message
        }
    };

    return (
        <div className="container-fluid help-us-container">
            <h2 className="text-center help-us-title">Help & Support</h2>
            
            <section className="help-us-section">
                <h3 className="section-title">About the Alumni Website</h3>
                <p className="section-description">
                    The Alumni Website is designed to connect our alumni with each other and with the institution. Here, you can find information on upcoming events, news, and resources tailored for our alumni community. Our goal is to provide a platform where you can reconnect with old friends, network with fellow graduates, and stay informed about the latest developments.
                </p>
            </section>

            <section className="help-us-section">
                <h3 className="section-title">Frequently Asked Questions</h3>
                <div className="faq">
                    <h4 className="faq-question">How can I update my profile information?</h4>
                    <p className="faq-answer">You can update your profile information by logging into the alumni portal and navigating to the 'Profile' section. Here, you'll find options to edit your contact details, education history, and other personal information.</p>
                    
                    <h4 className="faq-question">What should I do if I forget my password?</h4>
                    <p className="faq-answer">If you forget your password, you can click on the 'Forgot Password' link on the login page. Enter your registered email address, and we will send you a link to reset your password.</p>
                    
                    <h4 className="faq-question">How can I find information on upcoming alumni events?</h4>
                    <p className="faq-answer">Information on upcoming alumni events is available in the 'Events' section of the alumni website. You can also subscribe to our newsletter to receive regular updates about new events.</p>
                    
                    <h4 className="faq-question">Who can I contact for further assistance?</h4>
                    <p className="faq-answer">For further assistance, you can reach out to our support team via the 'Contact Us' page. We are here to help with any questions or concerns you may have.</p>
                </div>
            </section>

            {/* Display Submitted Questions */}
            <section className="submitted-questions">
                <h4 className="submitted-questions-title">Your Submitted Questions:</h4>
                <ul className="list-group">
                    {questions.map((question, index) => (
                        <li key={index} className="list-group-item list-group-item-action">
                            {question}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="help-us-question-box">
                <h4 className="question-title">Have a question? Ask us!</h4>
                <form onSubmit={handleQuestionSubmit}>
                    <div className="form-group">
                        <textarea 
                            className="form-control" 
                            id="userQuestion" 
                            rows="3" 
                            placeholder="Type your question here..." 
                            value={currentQuestion} 
                            onChange={(e) => setCurrentQuestion(e.target.value)}
                        ></textarea>
                        {error && <div className="text-danger mt-2">{error}</div>} {/* Display error message */}
                    </div>
                    <button type="submit" className="btn btn-primary btn-gradient">Submit</button>
                </form>
            </section>
        </div>
    );
};

export default HelpUs;
