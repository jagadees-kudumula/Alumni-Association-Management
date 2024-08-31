import React, { useEffect, useState } from 'react';

function AlumniDashboard() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/alumni_dashboard')
            .then((response) => response.json())
            .then((data) => setMessage(data.message))
            .catch((error) => console.error('Error fetching dashboard data:', error));
    }, []);

    return (
        <div>
            <h2>{message}</h2>
        </div>
    );
}

export default AlumniDashboard;
