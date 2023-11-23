import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Navbar from "../../../components/NavBar/navbar";

export default function MessageChat({ recUrl }) {
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [myFilteredMessages, setMyFilteredMessages] = useState([]);
    const [profile, setProfile] = useState({});
    const [recieverProfile, setRecieverProfile] = useState({});
    const [message, setMessage] = useState("");
    const receiverId = localStorage.getItem("receiver_url");

    useEffect(() => {
        async function getMessages() {
            try {
                const response = await fetch(`http://localhost:8000/messages`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
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
        const userId = localStorage.getItem("profile_id")
        const receiverId = localStorage.getItem("receiver_url");
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
        const userId = localStorage.getItem("profile_id")
        async function getProfile() {
            try {
                const response = await fetch(`http://localhost:8000/profile/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
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
            const receiverId = localStorage.getItem("receiver_url");
            try {
                const response = await fetch(`http://localhost:8000/profile/${receiverId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
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

    async function addMessage() {
        const userId = localStorage.getItem("profile_id");
        const receiverId = localStorage.getItem("receiver_url");
        try {
            const response = await fetch("http://localhost:8000/add_message/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({
                    sender_profile: `http://localhost:8000/profile/${userId}/`,
                    receiver_profile: `http://localhost:8000/profile/${receiverId}/`,
                    message_content: message,
                }),
            });
            if (response.ok) {
                // User successfully created, handle accordingly
                console.log("message added");
            } else {
                // Handle error cases
                console.log("Failed to add message");
            }
        } catch (error) {
            console.error("Error adding message", error);
        }
    }

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        addMessage();
        setMessage("");
    };
    const otherProfile = `/profile/${recieverProfile.id}`

    return (
        <div>
            <Link to='/profile'>
                <Button variant="Dark" className="float-start" style={{margin:'2vh' ,border: '2px solid black'}}>Back</Button>
            </Link>
            {profile && filteredMessages && (
                <><Link to={otherProfile}>
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <h1 style={{fontFamily: 'Croissant One', fontSize: '6vh'}}>{recieverProfile.first_name} {recieverProfile.last_name}</h1>
                    <img
                        src={recieverProfile?.profile_pic}
                        alt=""
                        style={{
                            maxWidth: "10vh",
                            maxHeight: "10vh",
                            borderRadius: "50%",
                            border: "3px solid black",
                        }}
                    />
                    </div>
                </Link>
                    <ul>
                        {myFilteredMessages.map((message) => (
                            <li style={{fontSize: '3vh', marginLeft: '5vh'}} key={message.url}>
                                <strong>{profile.first_name}:</strong> {message.message_content},
                            </li>
                        ))}
                        {filteredMessages.map((message) => (
                            <li style={{fontSize: '3vh', marginLeft: '95vh'}}key={message.url}>
                                <strong>{recieverProfile.first_name}:</strong> {message.message_content},
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <div style={{ position: 'absolute', bottom: 60, width: '100%' }}>
            <form style={{}} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={handleInputChange}
                    style={{ flex: 1, marginRight: '10px' }}
                />
                <button type="submit">Send</button>
            </form>
            <Navbar />
            </div>
        </div>
    );
}
