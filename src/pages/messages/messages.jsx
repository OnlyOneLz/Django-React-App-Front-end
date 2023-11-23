import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Navbar from "../../components/NavBar/navbar";


const MessagesPage = () => {
    const [messages, setMessages] = useState([]);
    // const [profiles, setProfiles] = useState([]);
    const [uniqueReceivers, setUniqueReceivers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch messages
                const messagesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/messages/`);
                setMessages(messagesResponse.data);

                // Fetch profiles
                // const profilesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile/`);
                // setProfiles(profilesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Create a set of unique receiver profile URLs
        const receiverSet = new Set(messages.map((message) => message.receiver_profile));

        // Fetch the unique receiver profiles, filtering out the sender's profile
        const fetchUniqueReceivers = async () => {
            const senderId = localStorage.getItem("profile_id");
            const uniqueReceiversResponse = await Promise.all(
                Array.from(receiverSet)
                    .filter((receiverUrl) => !receiverUrl.endsWith(`/${senderId}/`))
                    .map((receiverUrl) => axios.get(receiverUrl))
            );
            setUniqueReceivers(uniqueReceiversResponse.map((response) => response.data));
        };

        fetchUniqueReceivers();
    }, [messages]);

    function save(receiver) {
        if (receiver) {
            localStorage.setItem("receiver_url", receiver);
            navigate("/message_chat");
        } else {
            console.error("Receiver URL is undefined or null");
        }
    }

    return (
        <div className="messages-container">
            <Link to='/profile'>
                <Button variant="Dark" className="messages-back-btn" style={{border: '2px solid black', margin:'2vh'}}>Back</Button>
            </Link>
            <h1 style={{fontSize: '4vh', fontFamily:'Croissant One', marginTop: '-5vh'}}>Messages Page</h1>
            <h2 style={{fontSize: '3vh'}}>Chats:</h2>
            <ul className="messages-list">
                {uniqueReceivers.map((receiver) => (
                    <li key={receiver.url} className="messages-list-item">
                        <button
                            onClick={() => { console.log(receiver.id); save(receiver.id); }}
                            className="messages-list-button"
                        >
                            <img
                                src={receiver.profile_pic}
                                alt=""
                                style={{
                                    marginTop: '60px',
                                    border: '5px solid black',
                                    maxWidth: "125px",
                                    maxHeight: "1525px",
                                    borderRadius: "50%",
                                }}
                            />
                            {receiver.first_name} {receiver.last_name}
                        </button>
                        <hr />
                    </li>
                ))}
            </ul>
            <footer><Navbar /></footer>
        </div>
    );
}

export default MessagesPage;
