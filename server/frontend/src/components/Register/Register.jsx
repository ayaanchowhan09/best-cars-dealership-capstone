import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({ userName: '', firstName: '', lastName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const register = async (event) => {
    event.preventDefault();
    const response = await fetch('/djangoapp/register', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form) });
    const data = await response.json();
    if (data.status === 'Authenticated') {
      sessionStorage.setItem('username', data.userName); sessionStorage.setItem('firstname', data.firstName || ''); sessionStorage.setItem('lastname', data.lastName || '');
      window.location.href = '/dealers?state=All';
    } else setMessage(data.error || 'Registration failed.');
  };

  return <div className="auth_shell"><section className="auth_card register_card"><p className="eyebrow">BEST CARS DEALERSHIP</p><h1>Sign up</h1><p className="form_intro">Create an account to review dealerships and help fellow drivers.</p><form onSubmit={register}>
    <label>Username<input type="text" name="username" placeholder="Username" value={form.userName} onChange={update('userName')} required /></label>
    <div className="form_row"><label>First Name<input type="text" name="first_name" placeholder="First Name" value={form.firstName} onChange={update('firstName')} required /></label><label>Last Name<input type="text" name="last_name" placeholder="Last Name" value={form.lastName} onChange={update('lastName')} required /></label></div>
    <label>Email<input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required /></label>
    <label>Password<input name="psw" type="password" placeholder="Password" value={form.password} onChange={update('password')} required /></label>
    {message && <p className="form_message">{message}</p>}<button className="primary_button" type="submit">Register</button>
  </form><p className="auth_footer">Already registered? <a href="/login">Sign in</a></p></section></div>;
};

export default Register;
