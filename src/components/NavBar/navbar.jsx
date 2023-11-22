import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import your custom CSS file

export default function Navbar() {
    return (
        <div className="navbar-container">
            <nav className="navbar navbar-dark bg-dark fixed-bottom">
                <div className="container-fluid">
                    <Link to='/profile' className="navbar-brand">Profile</Link>
                    <span className="navbar-text">|</span>
                    <Link to='/feed' className="navbar-brand">Feed</Link>
                    <span className="navbar-text">|</span>
                    <Link to='/add_post' className="navbar-brand">Add Post</Link>
                </div>
            </nav>
        </div>
    );
}

