import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Feed() {
    const [feed, setFeed] = useState([]);
    const [profiles, setProfiles] = useState({});
    const navigate = useNavigate();
    const userId = localStorage.getItem("profile_id");

    useEffect(() => {
        async function getFeed() {
            try {
                const response = await fetch(`http://localhost:8000/media`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${btoa(
                            `${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASSWORD}`
                        )}`,
                    },
                });
                const result = await response.json();
                console.log(result);
                setFeed(result);

                // Fetch profiles for each document
                const profileRequests = result.map((document) =>
                    fetch(`http://localhost:8000/profile/${document.profile}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                    }).then((response) => response.json())
                );

                const profilesData = await Promise.all(profileRequests);
                const profilesMap = {};
                profilesData.forEach((profile) => {
                    profilesMap[profile.id] = profile;
                });
                setProfiles(profilesMap);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        }

        getFeed();
    }, []);

    function otherprofile(profileid) {
        if (parseInt(userId) === profileid) {
            navigate(`/profile`)
        } else {
            localStorage.setItem("other_profileId", profileid);
            localStorage.setItem("receiver_url", profileid);
            navigate(`/profile/${profileid}`)
        }
    }

    return (
        <div style={{ height: "80vh", margin: "0 auto", overflowY: "auto" }}>
            <Link to='/profile'>
                <Button variant="light" className="float-start">Back</Button>
            </Link>
            <Link to='/messages'>
                            <Button variant="light" className="float-end">Messages</Button>
                        </Link>
            <h1 style={{ textAlign: "center" }}>Feed</h1>
            <div
                style={{
                    justifyContent: "center",
                }}
            >
                {feed.map((document) => (
                    <div
                        key={document.id}
                        style={{
                            maxWidth: "80vh",
                            minHeight: "70vh",
                            border: "1px solid #ccc",
                            margin: "0 auto",
                            marginBottom: '5vh',
                            padding: "10px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <Button variant="light" className="float-end" onClick={() => otherprofile(profiles[document.profile]?.id)}>
                            <img
                                src={profiles[document.profile]?.profile_pic}
                                alt=""
                                style={{
                                    maxWidth: "125px",
                                    maxHeight: "125px",
                                    borderRadius: "50%",
                                    border: "3px solid black",
                                }}
                            />
                        </Button>
                        <br />
                        <img
                            src={document.document}
                            alt=""
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                margin: '0 auto'
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                width: "100%",
                                height: "40%",
                                background: "#333",
                                color: "#fff",
                                padding: "8px",
                                overflow: "hidden",
                            }}
                        >
                            <p className="float-end">Likes: {document.likes}</p>
                            <p>Description: {document.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
