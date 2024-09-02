import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { Form, Button, Container, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Contact.css'; // Make sure to create this CSS file for additional styles

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        emailjs.send(
            'service_6kyq3ic',
            'template_nsak27d',
            {
                to_name: formData.name,
                to_email: formData.email,
                message: formData.message,
            },
            'KppMtrnCjejguI-bO'
        )
     
        .then(() => {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        })
        .catch((error) => {
            setStatus('error');
        })
        .finally(() => {
            setLoading(false);
            setTimeout(() => setStatus(''), 3000);
        });
    };

    return (
        <Container className="mt-5 contact-container">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="p-4 shadow-sm">
                        <h2 className="text-center mb-4 contact-title">Contact Us</h2>
                        {status === 'success' && 
                            <Alert variant="success" className="fade-in">
                                Your message has been sent successfully!
                            </Alert>}
                        {status === 'error' && 
                            <Alert variant="danger" className="fade-in">
                                There was an error sending your message. Please try again.
                            </Alert>}
                        <Form onSubmit={handleSubmit} className={`contact-form ${status === 'success' ? 'form-hidden' : ''}`}>
                            <Form.Group controlId="formName" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="name" 
                                    placeholder="Enter your name" 
                                    value={formData.name}
                                    onChange={handleChange}
                                    required 
                                    className="form-control-lg"
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    name="email" 
                                    placeholder="Enter your email" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                    className="form-control-lg"
                                />
                            </Form.Group>
                            <Form.Group controlId="formMessage" className="mb-3">
                                <Form.Label>Message</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    name="message" 
                                    rows={5} 
                                    placeholder="Enter your message" 
                                    value={formData.message}
                                    onChange={handleChange}
                                    required 
                                    className="form-control-lg"
                                />
                            </Form.Group>
                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-100 btn-lg submit-btn" 
                                disabled={loading}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Send Message'}
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Contact;
