import React, { useState, useEffect } from 'react';
import './EventDetails.css';

const EventDetails = ({ match }) => {
    const [eventId, setEventId] = useState(localStorage.getItem('EventAppEventID'));
    const [event, setEvent] = useState({});
    const [guests, setGuests] = useState([]);
    const [isEditable, setIsEditable] = useState(false); // Add state variable

    useEffect(() => {
        fetch(`http://localhost:8080/fetchEventWithGuests?id=${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setEvent(data.event);
                setGuests(data.guests);
            })
            .catch(error => console.log(error))
    }, [eventId]);

    function goToHome() {
        window.location.href = '/dashboard';
    }

    function toggleEditMode() { // Add function to toggle edit mode
        setIsEditable(!isEditable);
    }

    function handleInputChange(event) { // Add function to handle input change
        const { name, value } = event.target;
        setEvent({ ...event, [name]: value });
        fetch('http://localhost:8080/groups/'+eventId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name}),
        })
        // console.log(event);
    }

    return (
        <div>
            <button onClick={goToHome}>Back</button>
            <button onClick={toggleEditMode}>{isEditable ? 'Save' : 'Edit'}</button> {/* Add edit button */}
            <div className="container">
                <h1>Event Details</h1>
                {isEditable ? ( // Render editable inputs if in edit mode
                    <div>
                        <label>Name</label>
                        <input type="text" name="name" value={event.name} onChange={handleInputChange} />
                        <label>Date</label>
                        <input type="date" name="eventDate" value={event.eventDate} onChange={handleInputChange} />
                        <label>Time</label>
                        <input type="time" name="eventTime" value={event.eventTime} onChange={handleInputChange} />
                        <label>Time Period</label>
                        {/*<input type="text" name="eventPeriod" value={event.eventPeriod} onChange={handleInputChange} />*/}
                        <select value={event.eventPeriod} onChange={handleInputChange}>
                            <option value="">Select event period</option>
                            <option value="30 mins">30 mins</option>
                            <option value="1 hour">1 hour</option>
                            <option value="1.5 hours">1.5 hours</option>
                            <option value="2 hours">2 hours</option>
                            <option value="2.5 hours">2.5 hours</option>
                            <option value="3 hours">3 hours</option>
                            <option value="3.5 hours">3.5 hours</option>
                            <option value="4 hours">4 hours</option>
                            <option value="4.5 hours">4.5 hours</option>
                            <option value="5 hours">5 hours</option>
                            <option value="5.5 hours">5.5 hours</option>
                            <option value="6 hours">6 hours</option>
                            <option value="6.5 hours">6.5 hours</option>
                            <option value="7 hours">7 hours</option>
                            <option value="7.5 hours">7.5 hours</option>
                            <option value="8 hours">8 hours</option>
                        </select>
                    </div>
                ) : ( // Render non-editable text if not in edit mode
                    <div>
                        <h2>Name: {event.name}</h2>
                        <p>Date: {event.eventDate}</p>
                        <p>Time: {event.eventTime}</p>
                        <p>Time Period: {event.eventPeriod}</p>
                    </div>
                )}
                <br/>
                <br/>
                <h3>Guests</h3>
                <ul>
                    {guests.map(guest => (
                        <li key={guest.id}>  {guest.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EventDetails;