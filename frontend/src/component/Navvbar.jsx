import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file
import { LoggedInContext } from "../context/LoggedInContext";
import logo from '../assets/logo.png'

const Navbar = ({ checklogin }) => {
  const { setmodelOpen } = useContext(LoggedInContext);

  const shownav = () => {
    const token = localStorage.getItem("token");
    if (checklogin || token) {
      return (
        <>
          <nav className="navbar">
            <Link to="/">
              <div className="logo-section">
                <img
                  src={logo}
                  alt="Logo"
                  className="logo"
                />
              </div>
            </Link>
            <div className="nav-links">
              <Link to="/createpost" className="nav-link">
                Create Post
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
            </div>
            <div className="search-section">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div>
            <div className="auth-section">
              <button className="login-btn" onClick={() => setmodelOpen(true)}>
                Logout
              </button>
            </div>
          </nav>
        </>
      );
    }
  };

  return <>{shownav()}</>;
};

export default Navbar;
