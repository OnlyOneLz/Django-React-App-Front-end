import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "react-bootstrap";


const MessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [uniqueReceivers, setUniqueReceivers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch messages
                const messagesResponse = await axios.get("http://localhost:8000/messages/");
                setMessages(messagesResponse.data);

                // Fetch profiles
                const profilesResponse = await axios.get("http://localhost:8000/profile/");
                setProfiles(profilesResponse.data);
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
        <div>
            <Link to='/profile'>
                <Button variant="Dark" className="float-end">Back</Button>
            </Link>
            <h1>Messages Page</h1>
            <h2>Chats:</h2>
            <ul>
                {uniqueReceivers.map((receiver) => (
                    <li key={receiver.url}>
                        <button onClick={() => { console.log(receiver.id); save(receiver.id); }}>
                            {receiver.first_name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessagesPage;
