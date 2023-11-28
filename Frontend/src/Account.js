import React, { useState } from 'react';
import './Account.css';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Send login request to server
    fetch('http://localhost:8080/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Handle login response here
        if (data.message == "User exists") {
          console.log("User exists");
          fetch(`http://localhost:8080/getUserInfo?email=${email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => response.json())
            .then(data => {
              console.log(data);
              localStorage.setItem('EventAppPersonID', data.id);
              localStorage.setItem('EventAppPersonName', data.name);
            });

          localStorage.setItem('EventAppPersonEMail', email);
          window.location.href = '/';
        }
        else {
          alert("User does not exist");
        }
      })
      .catch(error => {
        console.error(error);
        // Handle error here
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <label>Email:</label>
      <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
      <br />
      <label>Password:</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = () => {
    // Send registration request to server
    fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('EventAppPersonID', data.id);
        // Handle registration response here
        localStorage.setItem('EventAppPersonEMail', email);
        localStorage.setItem('EventAppPersonName', name);
        window.location.href = '/';
      })
      // .then(data => {
       
      // })
      .catch(error => {
        console.error(error);
        // Handle error here
      });
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
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

function Account() {
  const [activeTab, setActiveTab] = useState('login');

  const handleTabChange = tab => {
    setActiveTab(tab);
  };

  function handleHomeButton() {
    window.location.href = '/';
  }

  return (
    <div>
      <div>
        <button onClick={handleHomeButton}>Home</button>
        <button onClick={() => handleTabChange('login')}>Login</button>
        <button onClick={() => handleTabChange('register')}>Signup</button>
      </div>
      {activeTab === 'login' ? <LoginPage /> : <RegisterPage />}
    </div>
  );
}

export default Account;
