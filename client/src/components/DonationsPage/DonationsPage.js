import React, { useState } from 'react';
import './DonationsPage.css';

const DonationsPage = () => {
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState(''); // Added description state
    const [displayPublicly, setDisplayPublicly] = useState(false); // Added checkbox state
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handlePayment = async () => {
        if (!amount || !name || !email) {
            setError('Please fill in all the fields.');
            alert('Please fill in all the fields.');
            return;
        }

        try {
            const response = await fetch('/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseFloat(amount) * 100,
                    name,
                    email,
                    description,
                    displayPublicly, // Pass the checkbox value to the server
                }), // amount in paise
            });

            const data = await response.json();

            if (response.ok) {
                const { id, currency, amount, key } = data;

                const options = {
                    key,
                    amount,
                    currency,
                    name: 'Alumni Association',
                    description: 'Donation',
                    order_id: id,
                    handler: async function (response) {
                        try {
                            const result = await fetch('/verify-payment', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    order_id: response.order_id,
                                    payment_id: response.payment_id,
                                    signature: response.signature,
                                }),
                            });

                            if (result.ok) {
                                const data = await result.json();
                                if (data.success) {
                                    setSuccess('Payment successful! Thank you for your donation.');
                                    alert('Payment successful! Thank you for your donation.');
                                } else {
                                    setError('Payment verification failed.');
                                    alert('Payment verification failed.');
                                }
                            } else {
                                setError('Failed to verify payment.');
                                alert('Failed to verify payment.');
                            }
                        } catch (error) {
                            setError('An error occurred while verifying the payment.');
                            alert('An error occurred while verifying the payment.');
                            console.error('Verification Error:', error);
                        }
                    },
                    prefill: {
                        name,
                        email,
                    },
                    theme: {
                        color: '#007bff',
                    },
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else {
                setError('Failed to create payment order.');
                alert('Failed to create payment order.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            alert('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="donations-page">
            <h1>Donate</h1>
            <p className="donation-motivation">
                Your contribution can make a real difference. Help us support the future generation of students and give back to the community. Every donation, big or small, is a step toward building a better future together. Join us in making a lasting impact.
            </p>
            <div className="donation-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Amount (INR)</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description (Why are you donating?)</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="displayPublicly"
                        checked={displayPublicly}
                        onChange={(e) => setDisplayPublicly(e.target.checked)}
                    />
                    <label htmlFor="displayPublicly">Display my name publicly as a donor</label>
                </div>
                <button onClick={handlePayment} className="donate-button">
                    Donate
                </button>
            </div>
        </div>
    );
};

export default DonationsPage;
