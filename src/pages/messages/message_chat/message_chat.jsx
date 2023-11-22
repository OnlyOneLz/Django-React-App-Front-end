import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function MessageChat({ recUrl }) {
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [myFilteredMessages, setMyFilteredMessages] = useState([]);
    const [profile, setProfile] = useState({});
    const [recieverProfile, setRecieverProfile] = useState({});
    const receiverId = localStorage.getItem("receiver_url");
    const userId = localStorage.getItem("profile_id")

    useEffect(() => {
        async function getMessages() {
            try {
                const response = await fetch(`http://localhost:8000/messages`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASSWORD}`),
                    },
                });
                const result = await response.json();
                setMessages(result);
            } catch (error) {
                console.log("User not found", error);
            }
        }

        getMessages();
    }, []);

    useEffect(() => {
        // Filter messages based on receiverId
        const myfiltered = messages.filter(message => message.sender_profile === `http://localhost:8000/profile/${userId}/` &&
            message.receiver_profile === `http://localhost:8000/profile/${receiverId}/`);
        setMyFilteredMessages(myfiltered);
        const recieverFiltered = messages.filter(
            (message) => message.receiver_profile === `http://localhost:8000/profile/${userId}/` &&
                message.sender_profile === `http://localhost:8000/profile/${receiverId}/`);
        setFilteredMessages(recieverFiltered);
    }, [messages, receiverId]);

    useEffect(() => {
        // Fetch profile based on receiverId
        async function getProfile() {
            try {
                const response = await fetch(`http://localhost:8000/profile/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASSWORD}`),
                    },
                });
                const result = await response.json();
                setProfile(result);
            } catch (error) {
                console.log("Profile not found", error);
            }
        }

        getProfile();
        async function getRecieverProfile() {
            try {
                const response = await fetch(`http://localhost:8000/profile/${receiverId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASSWORD}`),
                    },
                });
                const result = await response.json();
                setRecieverProfile(result);
            } catch (error) {
                console.log("Profile not found", error);
            }
        }

        getRecieverProfile();
    }, [receiverId]);

    return (
        <div>
            <Link to='/profile'>
                <Button variant="Dark" className="float-end">Back</Button>
            </Link>
            {profile && filteredMessages && (
                <>
                    <h1>{recieverProfile.first_name} {recieverProfile.last_name}</h1>
                    <ul>
                        {myFilteredMessages.map((message) => (
                            <li key={message.url}>
                                <strong>{profile.first_name}:</strong> {message.message_content},
                            </li>
                        ))}
                        {filteredMessages.map((message) => (
                            <li key={message.url}>
                                <strong>{recieverProfile.first_name}:</strong> {message.message_content},
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
