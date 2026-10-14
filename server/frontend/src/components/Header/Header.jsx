import React, { useState } from 'react';
import "../assets/style.css";
import "../assets/bootstrap.min.css";

const Header = () => {
    const [username, setUsername] = useState(sessionStorage.getItem('username') || '');
    const logout = async (e) => {
    e.preventDefault();
    let logout_url = window.location.origin+"/djangoapp/logout";
    const res = await fetch(logout_url, {
      method: "GET",
    });
  
    const json = await res.json();
    if (json) {
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('firstname');
      sessionStorage.removeItem('lastname');
      setUsername('');
      window.location.href = "/";
    }
    else {
      alert("The user could not be logged out.")
    }
  };
    
    const home_page_items = username ? (
      <div className="input_panel">
        <span className='username'>Welcome, {username}</span>
        <a className="nav_item" href="/djangoapp/logout" onClick={logout}>Logout</a>
      </div>
    ) : (
      <div className="input_panel">
        <a className="nav_item" href="/login">Login</a>
        <a className="nav_item" href="/register">Register</a>
      </div>
    );
    return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light site_nav" style={{backgroundColor:"darkturquoise",height:"1in"}}>
            <div className="container-fluid">
              <h2 style={{paddingRight: "5%"}}>Dealerships</h2>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link active" style={{fontSize: "larger"}} aria-current="page" href="/">Home</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" style={{fontSize: "larger"}} href="/about">About Us</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" style={{fontSize: "larger"}} href="/contact">Contact Us</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" style={{fontSize: "larger"}} href="/dealers">Dealerships</a>
                  </li>
                </ul>
                <span className="navbar-text">
                  <div className="loginlink" id="loginlogout">
                  {home_page_items}
                  </div>
                  </span>
              </div>
            </div>
          </nav>
        </div>
    )
}

export default Header
