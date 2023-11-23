// SignUp.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import "./SignUp.css"; // Include your CSS file here

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    async function createUser() {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASSWORD}`),
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    password_confirmation: passwordConfirmation,
                }),
            });
            if (response.ok) {
                // User successfully created, handle accordingly
                console.log("User created successfully");
            } else {
                // Handle error cases
                console.log("Failed to create user");
            }
            // Your fetch logic here
        } catch (error) {
            console.error("Error creating user", error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        createUser();
        window.location.href = "/login";
    };

    return (
        <div className="signUp">
            <h1 style={{
                color: 'black',
                paddingLeft: '25vh'
            }}>Sign up</h1>
            <div className="container">
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                </Form.Group>

                <Button type="submit" variant="dark" className="mb-3" style={{color: 'black'}}>
                    Sign Up
                </Button>
                <Link to="/login">
                    <Button variant="light" className="float-start">
                        Login
                    </Button>
                </Link>
            </Form>
        </div>
        </div>
    );
}
