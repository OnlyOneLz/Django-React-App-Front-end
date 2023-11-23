import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../../components/NavBar/navbar";
import '../feed/feed.css'

export default function Feed() {
    const [feed, setFeed] = useState([]);
    const [profiles, setProfiles] = useState({});
    const navigate = useNavigate();
    const userId = localStorage.getItem("profile_id");

    useEffect(() => {
        async function getFeed() {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/media`, {
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
                    fetch(`${process.env.REACT_APP_BACKEND_URL}/profile/${document.profile}`, {
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
                <Button variant="light" className="float-start" style={{ border: '3px solid black', margin: '5vh'}}>Back</Button>
            </Link>
            <Link to='/messages'>
                <button variant="light" className='fa-brands fa-facebook-messenger float-end' style={{ border: '2px solid black',margin: '5vh', height: '4.5vh', width: '4.5vh' }}></button>
            </Link>
            <h1 className='h1-style' style={{ textAlign: "center", fontSize: '7vh', fontFamily: 'Croissant One' }}>Your Feed</h1>
            <hr />
            <div
                style={{
                    justifyContent: "center",
                    marginTop: '5vh'
                }}
            >
                {feed.map((document) => (
                    <div
                        key={document.id}
                        className="feed-card"
                    >
                        <div className="profile-pic-container">
                            <button variant="light" className="float-end" style={{margin: '2vh'}} onClick={() => otherprofile(profiles[document.profile]?.id)}>
                                <img
                                    src={profiles[document.profile]?.profile_pic}
                                    alt=""
                                    className="profile-pic"
                                />
                                <p style={{ color: 'white'}}>posted by {profiles[document.profile]?.first_name}</p>
                            </button>
                        </div>
                        <img
                            src={document.document}
                            alt=""
                            className="document-img"
                        />
                        <div className="overlay">
                            <p className="float-end">Likes: {document.likes}</p>
                            <p>Description: {document.title}</p>
                        </div>
                    </div>
                ))}
            </div>
            <footer><Navbar /></footer>
        </div>
    );
}
