import React from 'react';

const Homepage = () => {
  const isUserLoggedIn = () => localStorage.getItem('EventAppPersonID') !== null;

  const redirectTo = (path) => () => {
    window.location.href = isUserLoggedIn() ? path : '/login';
  };

  const logout = () => {
    ['EventAppPersonEMail', 'EventAppPersonID', 'EventAppPersonName'].forEach(key => localStorage.removeItem(key));
    window.location.href = '/';
  };

  return (
    <div>
      <div>
        <h1>Welcome to the Group Sports Event App!</h1>
        <p>Plan and join group sports events with ease.</p>
        <button onClick={redirectTo('/create-event')}>Create an Event</button>
        <button onClick={redirectTo('/join-event')}>Join an Event</button>
        <button onClick={redirectTo('/user-dashboard')}>View My Dashboard</button>
        <button onClick={redirectTo('/joined-events')}>Joined Events</button>
        {isUserLoggedIn() ? (
          <div>
            <p>Logged in as {localStorage.getItem('EventAppPersonName')}</p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div>
            <p>Not logged in</p>
            <button onClick={redirectTo('/login')}>Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
