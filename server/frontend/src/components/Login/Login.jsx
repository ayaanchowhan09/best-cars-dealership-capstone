import React, { useState } from 'react';
import "./Login.css";
import Header from '../Header/Header';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const login = async (event) => {
    event.preventDefault();
    const response = await fetch('/djangoapp/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ userName, password }) });
    const data = await response.json();
    if (data.status === 'Authenticated') {
      sessionStorage.setItem('username', data.userName); sessionStorage.setItem('firstname', data.firstName || ''); sessionStorage.setItem('lastname', data.lastName || '');
      window.location.href = '/dealers?state=All';
    } else setMessage('The username or password was not recognized.');
  };

  return <div className="page_shell"><Header /><main className="auth_shell"><section className="auth_card"><p className="eyebrow">WELCOME BACK</p><h1>Sign in</h1><p className="form_intro">Access dealer reviews and share your own experience.</p><form onSubmit={login}>
    <label>Username<input type="text" value={userName} onChange={(event) => setUserName(event.target.value)} placeholder="Username" required /></label>
    <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required /></label>
    {message && <p className="form_message">{message}</p>}<button className="primary_button" type="submit">Login</button>
  </form><p className="auth_footer">New here? <a href="/register">Create an account</a></p></section></main></div>;
};

export default Login;
