import React, { useEffect, useState } from 'react';
import './ViewAllEvents.css';

function ViewAllEvents() {
    const [events, setEvents] = useState([]);
    const [name, setName] = useState(localStorage.getItem('EventAppPersonName'));
    const [ ID, setID] = useState(localStorage.getItem('EventAppPersonID'));
    const [UserJoinedevents, setUserJoinedevents] = useState([]);


    const createEvent = () => {
        if(!isLoggedIn()) {
            window.location.href = '/login';
        }
        else{
            window.location.href = '/create-event';
        }
    }

    useEffect(() => {
        if(!isLoggedIn()) {
            window.location.href = '/login';
        }
    });

    useEffect(() => {
        fetch(`http://localhost:8080/getGroupsByUser?user_id=${localStorage.getItem('EventAppPersonID')}`)
            .then(response => response.json())
            .then(data => setUserJoinedevents(data.events))
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/groups')
            .then(response => response.json())
            .then(data => setEvents(data))
            .then(data => console.log(data))
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

    function joinEvent(EventID) {
        
        alert('joined sucessfully')
        
        if(!isLoggedIn()) {
            window.location.href = '/login';
        }
        else{
            fetch('http://localhost:8080/guests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, "group_id": EventID, "user_id": parseInt(ID)}),
            }).then(window.location.href = '/join-event');
         }
        return undefined;
    }

    function leaveEvent(EventID) {
        console.log(EventID);
        if (!isLoggedIn()) {
            window.location.href = '/login';
        }
        else {
            fetch(`http://localhost:8080/leave-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"group_id": EventID, "user_id": parseInt(ID)}),
            })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/join-event';
                    } else {
                        throw new Error('Failed to leave event');
                    }
                })
                .catch(error => console.error(error));
        }
    }

    return (
        <div>
            {/*<ExampleModal  isOpen={true} onRequestClose={() => {}} title="Example Modal" text="This is an example modal." />*/}
            <button onClick={goToHome}>Home</button>


            <div className="events-container">
                {events.map(group => (
                        <div className="group-card" key={group.id}>
                            <h2>{group.name}</h2>
                            {/*<p>{group.id}</p>*/}
                            <p>{group.eventTime}</p>
                            <p>{group.eventDate}</p>
                            <p>{group.eventPeriod}</p>
                



                            {UserJoinedevents && UserJoinedevents.includes(group.id) ?
                                <button style={{ color: 'black', backgroundColor: 'darkgrey' }} onClick={() => leaveEvent(group.id)}>Leave</button>
                                : (group.present >= group.max ?
                                        <button style={{ color: 'white', backgroundColor: 'red' }} disabled>Full</button>
                                        : <button onClick={() => joinEvent(group.id)}>Join</button>
                                )
                            }

                        </div>
                    ))
                }
                <div className="group-card">
                    <h3>Create New Event</h3>
                    <button onClick={createEvent}>Create</button>
                </div>
            </div>
        </div>
    );
}

export default ViewAllEvents;