import React, { useState } from 'react';

const createEvent = async (name, owner, eventDate, eventTime, eventPeriod, min, max, current, location) => {
  try {
    const response = await fetch('http://localhost:8080/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, owner, eventDate, eventTime, eventPeriod, min, max, current, location })
    });
    const data = await response.json();
    console.log(data);
    window.location.href = '/dashboard';
  } catch (error) {
    console.error(error);
    alert('Error creating event');
  }
};

function CreateEvent() {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState(parseInt(localStorage.getItem('EventAppPersonID')));
  const [eventTime, setEventTime] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventPeriod, setEventPeriod] = useState('');
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [current, setCurrent] = useState(1);
  const [location, setLocation] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (min > max) {
      alert('Minimum players cannot be greater than maximum players');
      return;
    }
    if (name === '' || eventTime === '' || eventDate === '' || eventPeriod === '') {
      alert('Please fill out all fields');
      return;
    }
    createEvent(name, owner, eventDate, eventTime, eventPeriod, min, max, current, location);
  };

  const goToHome = () => {
    window.location.href = '/';
  };

  return (
    <div>
      <button onClick={goToHome}>Home</button>
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          Event Name:
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <br />
        <label>
          Event Time:
          <input type="time" value={eventTime} onChange={(event) => setEventTime(event.target.value)} />
        </label>
        <br />
        <label>
          Event Date:
          <input type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} />
        </label>
        <br />
        <label>
          Min People:
          <input type="number" value={min} onChange={(event) => setMin(parseInt(event.target.value))} />
        </label>
        <br />
        <label>
          Max People:
          <input type="number" value={max} onChange={(event) => setMax(parseInt(event.target.value))} />
        </label>
        <br />
        <label>
          Location:
          <input type="text" value={location} onChange={(event) => setLocation(event.target.value)} />
        </label>
        <br />
        <label>
          Event Length:
          <select value={eventPeriod} onChange={(event) => setEventPeriod(event.target.value)}>
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
        </label>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
