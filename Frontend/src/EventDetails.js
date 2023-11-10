import React, { useState, useEffect } from 'react';
import './EventDetails.css';

const EventDetails = ({ match }) => {
  const [eventIdentifier, setEventIdentifier] = useState(localStorage.getItem('CustomEventAppEventID'));
  const [selectedEvent, setSelectedEvent] = useState({});
  const [eventParticipants, setEventParticipants] = useState([]);
  const [isModifiable, setIsModifiable] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/getEventWithParticipants?id=${eventIdentifier}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setSelectedEvent(data.eventDetails);
        setEventParticipants(data.attendees);
      })
      .catch(error => console.log(error));
  }, [eventIdentifier]);

  function navigateToDashboard() {
    window.location.href = '/dashboard';
  }

  function toggleModificationMode() {
    setIsModifiable(!isModifiable);
  }

  function handleEventDetailsChange(event) {
    const { name, value } = event.target;
    setSelectedEvent({ ...selectedEvent, [name]: value });
  }

  function applyChanges() {
    fetch(`http://localhost:8080/events/${eventIdentifier}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedEvent),
    })
      .then(response => {
        if (response.ok) {
          setIsModifiable(false);
        } else {
          throw new Error('Failed to apply changes');
        }
      })
      .catch(error => console.error(error));
  }

  return (
    <div>
      <button onClick={navigateToDashboard}>Return</button>
      {isModifiable ? (
        <button onClick={applyChanges}>Apply</button>
      ) : (
        <button onClick={toggleModificationMode}>Modify</button>
      )}
      <div className="custom-container">
        <h1>Event Information</h1>
        {isModifiable ? (
          <div>
            <label>Event Title</label>
            <input type="text" name="title" value={selectedEvent.title} onChange={handleEventDetailsChange} />
            <label>Date</label>
            <input type="date" name="eventDate" value={selectedEvent.eventDate} onChange={handleEventDetailsChange} />
            <label>Time</label>
            <input type="time" name="eventTime" value={selectedEvent.eventTime} onChange={handleEventDetailsChange} />
            <label>Duration</label>
            <select name="eventDuration" value={selectedEvent.eventDuration} onChange={handleEventDetailsChange}>
              <option value="">Select event duration</option>
              <option value="30 mins">30 mins</option>
              <option value="1 hour">1 hour</option>
              <option value="3 hours">3 hours</option>
            </select>
          </div>
        ) : (
          <div>
            <h2>Title: {selectedEvent.title}</h2>
            <p>Date: {selectedEvent.eventDate}</p>
            <p>Time: {selectedEvent.eventTime}</p>
            <p>Duration: {selectedEvent.eventDuration}</p>
          </div>
        )}
        <br />
        <br />
        <h3>Participants</h3>
        <ul>
          {eventParticipants.map(participant => (
            <li key={participant.id}> {participant.fullName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventDetails;
