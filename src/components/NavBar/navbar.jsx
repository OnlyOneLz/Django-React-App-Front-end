import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import your custom CSS file
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser, faRss, faPlus } from '@fortawesome/free-solid-svg-icons';


export default function Navbar() {
    return (
        <nav className="navbar navbar-dark bg-dark fixed-bottom">
            <div className="container-fluid" style={{display: 'flex', justifyContent: 'space-evenly'}}>
                <Link to='/feed' className="navbar-brand">
                    Feed
                </Link>
                <span className="navbar-text">|</span>
                <Link to='/add_post' className="navbar-brand">
                    Add Post
                </Link>
                <span className="navbar-text">|</span>
                <Link to='/profile' className="navbar-brand">
                    Profile
                </Link>
            </div>
        </nav>
    );
}

