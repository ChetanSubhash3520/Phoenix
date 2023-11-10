import React, { useEffect, useState } from 'react';
import './Userboard.css';
import { FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';

function Userboard() {
    const [userEvents, setUserEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const createNewEvent = () => {
        if (!checkLoggedIn()) {
            window.location.href = '/login';
        } else {
            window.location.href = '/create-event';
        }
    };

    useEffect(() => {
        fetch('http://localhost:8080/events')
            .then(response => response.json())
            .then(data => setUserEvents(data))
            .catch(error => console.error(error));
    }, []);

    function navigateToHome() {
        window.location.href = '/';
    }

    function checkLoggedIn() {
        return localStorage.getItem('UserAppPersonID') !== null;
    }

    function handleEventDeletion(eventID) {
        console.log(eventID);
        fetch(`http://localhost:8080/events/${eventID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(() => {
            // Reload events after deletion
            fetch('http://localhost:8080/events')
                .then(response => response.json())
                .then(data => setUserEvents(data))
                .catch(error => console.error(error));
        });
    }

    function navigateToEventDetails(id) {
        localStorage.setItem('UserAppEventID', id);
        window.location.href = '/eventDetails';
    }

    return (
        <div>
            <button onClick={navigateToHome}>Home</button>

            <div className="user-events-container">
                {userEvents
                    .filter(event => event.Owner === parseInt(localStorage.getItem('UserAppPersonID')))
                    .map(event => (
                        <div className="user-event-card" key={event.id}>
                            <h2>{event.name}</h2>
                            <br />
                            <p>Time: {event.eventDate}, {event.eventTime}</p>
                            <p>Period: {event.eventPeriod}</p>
                            <button onClick={() => navigateToEventDetails(event.id)}>Details</button>
                            <br />
                            <FaTrash className="delete-icon" onClick={() => handleEventDeletion(event.id)} />
                        </div>
                    ))}
            </div>
            <div className="user-event-card">
                <h3>Create New Event</h3>
                <button onClick={createNewEvent}>Create</button>
            </div>

            <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

const CustomModal = ({ isOpen, onClose }) => {
    const [inputText, setInputText] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Do something with the text input
        setInputText('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen}>
            <h2>Custom Modal</h2>
            <form onSubmit={handleFormSubmit}>
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
            <button onClick={onClose}>Close</button>
        </Modal>
    );
};

export default Userboard;