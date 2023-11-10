import React, { useState } from 'react';
import './UserAccount.css';

const loginUser = (email, passcode) => {
  return fetch('http://localhost:8080/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, passcode }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.message === "User exists") {
        console.log("User exists");
        return fetch(`http://localhost:8080/getUserInfo?email=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(userData => {
            console.log(userData);
            localStorage.setItem('EventAppPersonID', userData.id);
            localStorage.setItem('EventAppPersonName', userData.name);
          })
          .then(() => {
            localStorage.setItem('EventAppPersonEMail', email);
            window.location.href = '/';
          });
      } else {
        alert("User does not exist");
      }
    })
    .catch(error => {
      console.error(error);
    });
};

const registerUser = (name, email, passcode) => {
  return fetch('http://localhost:8080/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, passcode }),
  })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('EventAppPersonID', data.id);
    })
    .then(() => {
      localStorage.setItem('EventAppPersonEMail', email);
      localStorage.setItem('EventAppPersonName', name);
      window.location.href = '/';
    })
    .catch(error => {
      console.error(error);
    });
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');

  const handleLogin = () => {
    loginUser(email, passcode);
  };

  return (
    <div>
      <h2>Login</h2>
      <label>Email:</label>
      <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
      <br />
      <label>Password:</label>
      <input type="password" value={passcode} onChange={e => setPasscode(e.target.value)} />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [name, setName] = useState('');

  const handleRegister = () => {
    registerUser(name, email, passcode);
  };

  return (
    <div>
      <h2>Register</h2>
      <label>Name:</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <br />
      <label>Email:</label>
      <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
      <br />
      <label>Password:</label>
      <input type="password" value={passcode} onChange={e => setPasscode(e.target.value)} />
      <br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

const Account = () => {
  const [activeTab, setActiveTab] = useState('login');

  const handleTabChange = tab => {
    setActiveTab(tab);
  };

  const handleHomeButton = () => {
    window.location.href = '/';
  };

  return (
    <div>
      <div>
        <button onClick={handleHomeButton}>Home</button>
        <button onClick={() => handleTabChange('login')}>Login</button>
        <button onClick={() => handleTabChange('register')}>Register</button>
      </div>
      {activeTab === 'login' ? <LoginPage /> : <RegisterPage />}
    </div>
  );
};

export default Account;
