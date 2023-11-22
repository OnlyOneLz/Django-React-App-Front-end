import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function Profile() {
    const [profile, setProfile] = useState();
    const [feed, setFeed] = useState([]);


    useEffect(() => {
        async function getProfile() {
            const userId = localStorage.getItem("profile_id");
            try {
                const response = await fetch(`http://localhost:8000/profile/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                });
                const result = await response.json();
                setProfile(result);
            } catch (error) {
                console.log("User not found", error);
            }
        }
        getProfile();

        async function getFeed() {
            const userId = localStorage.getItem("profile_id");
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
                const filteredFeed = result.filter((document) => document.profile === userId);

                console.log(filteredFeed);
                setFeed(filteredFeed);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        }
        getFeed()
    }, []);

    return (
        <div className="container-fluid">
            {/* Top container */}
            <div className="row">
                <div className="col-md-">
                    {/* Adjust the height as needed */}
                    <div className="top-container" style={{ height: "50vh", backgroundColor: "#f8f9fa", padding: "20px" }}>
                        <Link to='/settings'>
                            <Button variant="light" className="float-end">Settings</Button>
                        </Link>
                        <Link to='/messages'>
                            <Button variant="light" className="float-start">Messages</Button>
                        </Link>
                        {profile?.profile_pic && (
                            <img
                                src={profile.profile_pic}
                                alt=""
                                style={{
                                    marginTop: '40px',
                                    marginLeft: '-100px',
                                    maxWidth: "125px", // Set your desired maximum width
                                    maxHeight: "1525px", // Set your desired maximum height
                                    borderRadius: "50%", // Make it a circle
                                    // overflow: "hidden", // Hide the parts outside the circle
                                    // objectFit: "cover", // Cover the container while maintaining aspect ratio
                                }}
                            />
                        )}
                        <div style={{ padding: '-0.5vh' }}>
                            <h1 style={{ textAlign: 'left', marginBottom: '-0.5vh' }}>{profile?.first_name} {profile?.last_name}</h1>
                            <p style={{ marginBottom: '-0.5vh' }}>Contact Info:</p>
                            <p>{profile?.email}</p>
                            <hr />
                            <p>{profile?.bio}</p>
                        </div>
                        <hr />
                    </div>
                    <h2 style={{ textAlign: 'center' }}>My Posts</h2>
                </div>
                <div className="posts-container" style={{
                    height: "66vh", width: '250vh', backgroundColor: "#ffffff", padding: "20px", display: "flex",
                    flexDirection: "row", flexWrap: 'wrap',
                }}>
                    {feed.map((document) => (
                        <div
                            key={document.id}
                            style={{
                                maxWidth: "50vh",
                                minHeight: "60vh",
                                border: "1px solid #ccc",
                                margin: "0 auto",
                                marginBottom: '5vh',
                                padding: "10px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            {/* <Button variant="light" className="float-end" onClick={() => otherprofile(profiles[document.profile]?.id)}> */}
                            {/* <img
                                src={profile[document.profile.profile_pic}
                                alt=""
                                style={{
                                    maxWidth: "125px",
                                    maxHeight: "125px",
                                    borderRadius: "50%",
                                    border: "3px solid black",
                                }}
                            /> */}
                            {/* </Button> */}
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
            <div className="navbar fixed-bottom" style={{ backgroundColor: "#f8f9fa", padding: "10px" }}>
                {/* Your existing bottom navbar content */}
            </div>
        </div>
    );
}
