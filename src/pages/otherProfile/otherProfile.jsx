import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap"; // Import Bootstrap Button component

export default function OtherProfile() {
    const [profile, setProfile] = useState();

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
    }, []);

    return (
        <div className="container-fluid">
        {/* Top container */}
        <div className="row">
            <div className="col-md-">
                {/* Adjust the height as needed */}
                <div className="top-container" style={{ height: "50vh", backgroundColor: "#f8f9fa", padding: "20px" }}>
                    <Link to='/message_chat'>
                        <Button variant="light" className="float-start">Send Messages</Button>
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
                    <div style={{padding: '-0.5vh'}}>
                    <h1 style={{textAlign: 'left', marginBottom: '-0.5vh'}}>{profile?.first_name} {profile?.last_name}</h1>
                    <p style={{marginBottom: '-0.5vh'}}>Contact Info:</p>
                    <p>{profile?.email}</p>
                    <hr/>
                    <p>{profile?.bio}</p>
                    </div>
                    <hr />
                </div>
                <h2 style={{textAlign: 'center'}}>My Posts</h2>
            </div>
                <div className="posts-container" style={{ height: "66vh", width: '250vh', backgroundColor: "#ffffff", padding: "20px" }}>
                    {/* Your existing posts content */}
                </div>
        </div>
        <div className="navbar fixed-bottom" style={{ backgroundColor: "#f8f9fa", padding: "10px" }}>
            {/* Your existing bottom navbar content */}
        </div>
    </div>
);
}


