import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap"; // Import Bootstrap Button component
import Navbar from "../../components/NavBar/navbar";
import '..//profile/profile.css'

export default function OtherProfile() {
    const [profile, setProfile] = useState();
    const [feed, setFeed] = useState([]);
    const [follows, setFollows] = useState(false);
    const [filFollows, setFilFollows] = useState(false);


    useEffect(() => {
        async function getProfile() {
            const userId = localStorage.getItem("other_profileId");
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
            const userId = localStorage.getItem("other_profileId");
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
                const filteredFeed = result.filter((document) => document.profile === parseInt(userId));

                console.log(filteredFeed);
                setFeed(filteredFeed);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        }
        getFeed()

        async function getFollows() {
            const otherUserId = localStorage.getItem("other_profileId");
            const userId = localStorage.getItem("profile_id");
            console.log(otherUserId);
            console.log(userId);
            try {
                const response = await fetch(`http://localhost:8000/follows`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${btoa(
                            `${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASSWORD}`
                        )}`,
                    },
                });
                const result = await response.json();
                const filteredFollows = result.filter((follows) => follows.sender_profile === `http://localhost:8000/profile/${parseInt(userId)}/` && follows.receiver_profile === `http://localhost:8000/profile/${parseInt(otherUserId)}/`);
                console.log(filteredFollows);
                setFilFollows(filteredFollows)
                if (filteredFollows.length > 0) {
                    setFollows(true);
                } else {
                    setFollows(false)
                }
            } catch (error) {
                console.log("Error fetching data", error);
            }
        }
        getFollows()
    }, []);
    async function Follow() {
        const userId = localStorage.getItem("profile_id");
        const receiverId = localStorage.getItem("receiver_url");
        try {
            const response = await fetch("http://localhost:8000/create_follow/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({
                    sender_profile: `http://localhost:8000/profile/${userId}/`,
                    receiver_profile: `http://localhost:8000/profile/${receiverId}/`,
                }),
            });
            if (response.ok) {
                // User successfully created, handle accordingly
                console.log("user followed");
                setFollows(true)
            } else {
                // Handle error cases
                console.log("Failed to follow user");
            }
        } catch (error) {
            console.error("Error adding message", error);
        }
    }
    async function Unfollow() {
        if (filFollows) {
            try {
                const response = await fetch(`${filFollows[0].url}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                if (response.ok) {
                    // User successfully created, handle accordingly
                    console.log("user unfollowed");
                    setFollows(false)
                } else {
                    // Handle error cases
                    console.log("Failed to unfollow user");
                    setFollows(false)
                }
            } catch (error) {
                console.error("Error adding message", error);
            }
        }

    }

    return (
        <div className="container-fluid">
            {/* Top container */}
            <div className="row">
                <div className="col-md-" >
                    {/* Adjust the height as needed */}
                    <div className="top-container" style={{ height: "40vh", backgroundColor: "#f8f9fa", padding: "20px" , margin: '0'}}>
                        <Link to='/message_chat'>
                            <Button variant="light" className="float-start" style={{ border: '2px solid black', marginBottom: '1vh' }}>Send Message</Button>
                        </Link>
                        {profile?.profile_pic && (
                            <img
                                src={profile.profile_pic}
                                alt=""
                                style={{
                                    marginTop: '60px',
                                    border: '5px solid black',
                                    maxWidth: "125px",
                                    maxHeight: "1525px",
                                    borderRadius: "50%",
                                }}
                            />
                        )}
                        <div>
                            {!follows ? <Button variant="light" className="float-end" style={{ border: '2px solid black' }} onClick={() => Follow()}>Follow {profile?.first_name}</Button> : <Button variant="light" className="float-end" style={{ border: '2px solid black' }} onClick={() => Unfollow()}>Unfollow {profile?.first_name}</Button>}
                        </div>
                        <div style={{ marginTop: '2vh', marginBottom: '2vh' }}>
                            <h1 style={{ textAlign: 'left', fontSize: '4vh' }}>{profile?.first_name} {profile?.last_name}</h1>
                            <p style={{ marginBottom: '-0.5vh' }}>Contact Info:</p>
                            <p>{profile?.email}</p>
                            <hr />
                            <p style={{ marginTop: '2vh' }}>{profile?.bio}</p>
                        </div>
                        <hr />
                    </div>
                    <h2 style={{ marginLeft: '0', width: '100vh', marginTop: '6vh' ,textAlign: 'center', fontSize: '5vh' , backgroundColor: 'rgb(86, 79, 79)', }}>Posts</h2>

                </div>
                <div className="custom-posts-container" style={{
                    height: "100vh", width: '100vh', display: "flex",
                    flexDirection: "row", flexWrap: 'wrap',
                    justifyContent: "space-evenly",
                    padding: "20px"
                }}>
                    {feed.map((document) => (
                        <div
                            key={document.id}
                            className="custom-post-card"
                        >
                            <div className="custom-profile-pic-container">
                                {profile?.profile_pic && (
                                    <img
                                        className="custom-profile-pic"
                                        src={profile.profile_pic}
                                        alt=""
                                    />
                                )}
                            </div>
                            <img
                                className="custom-post-img"
                                src={document.document}
                                alt=""
                            />
                            <div className="custom-post-details">
                                <p className="custom-likes">Likes: {document.likes}</p>
                                <p className="custom-description">{document.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            <div className="custom-navbar fixed-bottom" style={{ backgroundColor: "#f8f9fa", padding: "10px" }}>
                {/* Your existing bottom navbar content */}
            </div>
            <footer><Navbar /></footer>
        </div>
    )
}
