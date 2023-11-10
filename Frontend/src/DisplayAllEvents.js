import React, { useEffect, useState } from 'react';
import './DisplayAllEvents.css';

function DisplayAllEvents() {
  const [teamsData, setTeamsData] = useState([]);
  const [participantName, setParticipantName] = useState(localStorage.getItem('CustomEventAppParticipantName'));
  const [participantID, setParticipantID] = useState(localStorage.getItem('CustomEventAppParticipantID'));
  const [userJoinedTeams, setUserJoinedTeams] = useState([]);

  const startCustomEvent = () => {
    if (!isLoggedIn()) {
      window.location.href = '/login';
    } else {
      window.location.href = '/start-custom-event';
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/getUserJoinedTeams?participant_id=${localStorage.getItem('CustomEventAppParticipantID')}`)
      .then(response => response.json())
      .then(data => setUserJoinedTeams(data.joinedTeams))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/teams-data')
      .then(response => response.json())
      .then(data => setTeamsData(data))
      .catch(error => console.error(error));
  }, []);

  function navigateToHome() {
    window.location.href = '/';
  }

  function isLoggedIn() {
    return localStorage.getItem('CustomEventAppParticipantID') !== null;
  }

  function joinTeam(teamID) {
    console.log(teamID);
    if (!isLoggedIn()) {
      window.location.href = '/login';
    } else {
      fetch('http://localhost:8080/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: participantName, team_id: teamID, participant_id: parseInt(participantID) }),
      }).then(() => {
        window.location.href = '/join-event-team';
      });
    }
  }

  function leaveTeam(teamID) {
    console.log(teamID);
    if (!isLoggedIn()) {
      window.location.href = '/login';
    } else {
      fetch(`http://localhost:8080/leave-team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team_id: teamID, participant_id: parseInt(participantID) }),
      })
        .then(response => {
          if (response.ok) {
            window.location.href = '/event-display';
          } else {
            throw new Error('Failed to leave event');
          }
        })
        .catch(error => console.error(error));
    }
  }

  return (
    <div>
      <button onClick={navigateToHome}>Home</button>

      <div className="team-data-container">
        {teamsData
          .filter(team => userJoinedTeams != null && userJoinedTeams.includes(team.id))
          .map(team => (
            <div className="team-card" key={team.id}>
              <h2>{team.name}</h2>
              <p>{team.eventTime}</p>
              <p>{team.eventDate}</p>
              <p>{team.eventPeriod}</p>
              <p>{team.current}/{team.max} Filled</p>
              {userJoinedTeams && userJoinedTeams.includes(team.id) ? (
                <button style={{ color: 'black', backgroundColor: 'darkgrey' }} onClick={() => leaveTeam(team.id)}>
                  Leave
                </button>
              ) : team.current >= team.max ? (
                <button style={{ color: 'white', backgroundColor: 'red' }} disabled>
                  Full
                </button>
              ) : (
                <button onClick={() => joinTeam(team.id)}>Join</button>
              )}
            </div>
          ))}
        <div className="team-card">
          <h3>Create New Event Team</h3>
          <button onClick={startCustomEvent}>Create</button>
        </div>
      </div>
    </div>
  );
}

export default DisplayAllEvents;
