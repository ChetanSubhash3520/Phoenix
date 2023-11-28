import React, { useEffect, useState } from 'react';
import './MyDashboard.css';
import { FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';



function MyDashboard() {
    const [events, setEvents] = useState([]);


    const createEvent = () => {
        if(!isLoggedIn()) {
            window.location.href = '/login';
        }
        else{
            window.location.href = '/create-event';
        }
    }





    useEffect(() => {
        fetch('http://localhost:8080/groups')
            .then(response => response.json())
            .then(data => setEvents(data))
            .catch(error => console.error(error));
    }, []);

    function goToHome() {
        window.location.href = '/';
    }

    function isLoggedIn() {
        if(localStorage.getItem('EventAppPersonID') != null) {
            return true;
        }
        else {
            return false;
        }
    }

    function handleDelete(ID) {
        console.log(ID);
        fetch('http://localhost:8080/groups/'+ID, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        window.location.href = '/dashboard';

    }

    function goToEventDetails(id) {
        localStorage.setItem('EventAppEventID', id);
        window.location.href = '/eventDetails';
    }

    return (
        <div>

        {/*<ExampleModal  isOpen={true} onRequestClose={() => {}} title="Example Modal" text="This is an example modal." />*/}
            <button onClick={goToHome}>Home</button>

            <div className="events-container">
                {events
                    .filter(group => group.Leader === parseInt(localStorage.getItem('EventAppPersonID')))
                    .map(group => (
                        <div className="group-card" key={group.id}>
                            <h2>{group.name}</h2>
                            <br/>

                            {/*<p>{group.id}</p>*/}
                            <p>Time: {group.eventDate}, {group.eventTime}</p>
                            <p>Period: {group.eventPeriod}</p>
                            <button onClick={() => goToEventDetails(group.id)}>Details</button>
                            <br/>
                            <FaTrash className="delete-icon" onClick={() => handleDelete(group.id)} />
                        </div>
                    ))
                }
            </div>
            <div className="group-card">
                <h3>Create New Event</h3>
                <button onClick={createEvent}>Create</button>
            </div>
        </div>
    );
}

const MyModal = ({ isOpen, onClose }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Do something with the text input
        setText('');
        onClose();
    };

    onClose = () => {
        isOpen = false;
    }



    return (
        <Modal isOpen={isOpen}>
            <h2>My Modal</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
            <button onClick={onClose}>Close</button>
        </Modal>
    );
};







export default MyDashboard;