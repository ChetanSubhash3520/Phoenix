import React, { useEffect, useState } from 'react';
import './UserEvents.css';

function JoinedEvents() {
  const [eventsByUser, setEventsByUser] = useState([]);
  const [participantFullName, setParticipantFullName] = useState(localStorage.getItem('CustomEventAppParticipantFullName'));
  const [participantIdentifier, setParticipantIdentifier] = useState(localStorage.getItem('CustomEventAppParticipantID'));
  const [attendedUserEvents, setAttendedUserEvents] = useState([]);

  const initiateCustomEvent = () => {
    if (!isParticipantLoggedIn()) {
      window.location.href = '/login';
    } else {
      window.location.href = '/initiate-custom-event';
    }
  };

  useEffect(() => {
    if (!isParticipantLoggedIn()) {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/getAttendedUserEvents?participant_id=${localStorage.getItem('CustomEventAppParticipantID')}`)
      .then(response => response.json())
      .then(data => setAttendedUserEvents(data.attendedEvents))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/custom-events')
      .then(response => response.json())
      .then(data => setEventsByUser(data))
      .catch(error => console.error(error));
  }, []);

  function goToStart() {
    window.location.href = '/';
  }

  function isParticipantLoggedIn() {
    return localStorage.getItem('CustomEventAppParticipantID') !== null;
  }

  function participateInEvent(eventID) {
    console.log(eventID);
    if (!isParticipantLoggedIn()) {
      window.location.href = '/login';
    } else {
      fetch('http://localhost:8080/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName: participantFullName, event_id: eventID, participant_id: parseInt(participantIdentifier) }),
      }).then(() => {
        window.location.href = '/participate-event';
      });
    }
  }

  function exitEvent(eventID) {
    console.log(eventID);
    if (!isParticipantLoggedIn()) {
      window.location.href = '/login';
    } else {
      fetch(`http://localhost:8080/exit-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_id: eventID, participant_id: parseInt(participantIdentifier) }),
      })
        .then(response => {
          if (response.ok) {
            window.location.href = '/custom-events';
          } else {
            throw new Error('Failed to exit event');
          }
        })
        .catch(error => console.error(error));
    }
  }

  return (
    <div>
      <button onClick={goToStart}>Start</button>

      <div className="custom-events-container">
        {eventsByUser
          .filter(event => attendedUserEvents != null && attendedUserEvents.includes(event.id))
          .map(event => (
            <div className="custom-event-card" key={event.id}>
              <h2>{event.title}</h2>
              <p>{event.time}</p>
              <p>{event.date}</p>
              <p>{event.duration}</p>
              <button style={{ color: 'black', backgroundColor: 'darkgrey' }} onClick={() => exitEvent(event.id)}>
                Exit
              </button>
            </div>
          ))}
        <div className="custom-event-card">
          <h3>Create New Custom Event</h3>
          <button onClick={initiateCustomEvent}>Create</button>
        </div>
      </div>
    </div>
  );
}

export default JoinedEvents;
