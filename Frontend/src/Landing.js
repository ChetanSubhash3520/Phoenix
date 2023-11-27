import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import App from "./Account";

function Homepage() {

    function isLoggedIn() {
        if(localStorage.getItem('EventAppPersonID') != null) {
            return true;
        }
        else {
            return false;
        }
    }


    function goToCreateEvent() {
        if(!isLoggedIn()) {
            window.location.href = '/login';
        }
        else{
            window.location.href = '/create-event';

        }
    }
    function goToJoinEvent() {
        window.location.href = '/join-event';

    }
    function goToMyDashboard() {

        if(!isLoggedIn()) {
            window.location.href = '/login';
        }
        else{
            window.location.href = '/dashboard';
        }
    }

    function goToJoinedEvents() {

            if(!isLoggedIn()) {
                window.location.href = '/login';
            }
            else{
                window.location.href = '/joined-events';
            }
    }


    function logout() {
        localStorage.removeItem('EventAppPersonEMail');
        localStorage.removeItem('EventAppPersonID');
        localStorage.removeItem('EventAppPersonName');
        window.location.href = '/';
    }

    function goToLogin() {
        window.location.href = '/login';
    }

    return (
        <div>
        <div>

            <h1>Welcome to the Event Handler App!</h1>
            <p>Plan and conduct events with ease.</p>
                <button onClick={goToCreateEvent}>Create a Event</button>
                <button onClick={goToJoinEvent}>Join a Event</button>
                <button onClick={goToMyDashboard}>View My Dashboard</button>
                <button onClick={goToJoinedEvents}>Joined Events</button>
            {isLoggedIn() &&
                <div>
                <p>Logged in as {localStorage.getItem('EventAppPersonName')}</p>
                <button onClick={logout}>Logout</button>
                </div>
            }
            {!isLoggedIn() &&
                <div>
                <p>Not logged in</p>
                <button onClick={goToLogin}>Login/Register</button>
                </div>
            }


        </div>

        </div>
    );
}

export default Homepage;
