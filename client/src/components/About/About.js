import React from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './About.css'; // Ensure this CSS file exists for custom styles
import picture from './alu1.webp';
import picture2 from './alu2.webp';
import picture3 from './alu3.jpeg';
import video1 from './video.mp4';
import { faRodAsclepius } from '@fortawesome/free-solid-svg-icons';

function About() {
    return (
        <Container className="mt-5 about-container animate__animated animate__fadeIn" style={{
            backgroundColor:''
        }}>
            <h2 className="text-center mb-4 about-title"><u>About Us</u></h2>
            <Row className="justify-content-md-center">
                <Col md={10}>
                    <Card className="p-4 shadow-lg border-light about-card">
                        <Carousel indicators={true} controls={false} fade={true} interval={3000} className="about-carousel">
                            <Carousel.Item>
                                <img
                                    className="d-block w-100 about-image"
                                    src={picture}
                                    alt="Slide 1"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100 about-image"
                                    src={picture2}
                                    alt="Slide 2"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100 about-image"
                                    src={picture3}
                                    alt="Slide 3"
                                />
                            </Carousel.Item>
                        </Carousel>
                        <Card.Body className='body'>
                            <Card.Text className="about-text">
                                Welcome to the Alumni Portal! This platform is dedicated to fostering connections among alumni, providing opportunities for professional growth, and offering a space to share achievements and memories. Our mission is to build a strong, engaged alumni community that supports both personal and professional development.
                            </Card.Text>
                            <Card.Text className="about-text">
                                The Alumni Portal is your gateway to reconnecting with former classmates, staying updated on alumni events, and participating in various alumni activities. We encourage all members to contribute to the community by sharing their experiences and helping each other in various endeavors.
                            </Card.Text>
                            <Card.Text className="about-text">
                                Our vision is to create a network where alumni can continue to benefit from the relationships and knowledge they gained during their time at the institution. Whether you are looking to connect with old friends, explore career opportunities, or give back to the community, the Alumni Portal is here to support you.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Additional Section with Graduation Video */}
            <Row className="justify-content-md-center mt-5">
                <Col md={10}>
                    <Card className="p-4 shadow-lg border-light about-card">
                        <h3 className="text-center mb-4 about-subtitle"><u>Memorable Graduation Moments</u> </h3>
                        <Card.Body className="text-center">
                            <video 
                                autoPlay 
                                muted 
                                loop 
                                className="about-video"
                            >
                                <source src={video1} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <Card.Text className="about-text mt-4">
                                Relive the memorable moments from our graduation ceremonies. This video captures the essence of our shared experiences, the joy of achievements, and the excitement of stepping into the future together.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default About;
