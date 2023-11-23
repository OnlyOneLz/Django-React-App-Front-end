import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Navbar from "../../components/NavBar/navbar";
import '../profile/profile.css'

export default function Profile() {
    const [profile, setProfile] = useState();
    const [feed, setFeed] = useState([]);
    const [filFollowing, setFilFollowing] = useState([]);
    const [filFollows, setFilFollows] = useState([]);
    const [posts, setPosts] = useState(false);


    useEffect(() => {
        async function getProfile() {
            const userId = localStorage.getItem("profile_id");
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/profile/${userId}`, {
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
                const filteredFeed = result.filter((document) => document.profile === parseInt(userId));
                setFeed(filteredFeed);
                if (filteredFeed.length > 0)  {
                    setPosts(true)
                }else{
                    setPosts(false)
                }
            } catch (error) {
                console.log("Error fetching data", error);
            }
        }
        getFeed()

        async function getFollows() {
            // const otherUserId = localStorage.getItem("other_profileId");
            const userId = localStorage.getItem("profile_id");
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/follows`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${btoa(
                            `${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASSWORD}`
                        )}`,
                    },
                });
                const result = await response.json();
                const filteredFollows = result.filter((follows) => follows.receiver_profile === `${process.env.REACT_APP_BACKEND_URL}/profile/${parseInt(userId)}/`);
                const filteredFollowing = result.filter((follows) => follows.sender_profile === `${process.env.REACT_APP_BACKEND_URL}/${parseInt(userId)}/`);
                setFilFollows(filteredFollows)
                setFilFollowing(filteredFollowing)
            } catch (error) {
                console.log("Error fetching data", error);
            }
        }
        getFollows()
    }, [posts]);

    async function deletePost(id) {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/media/${id}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            if (response.ok) {
                console.log('Post Deleted');
                if(!posts){
                    setPosts(false)
                }
            }
        } catch (error) {
            console.log("User not found", error);
        }
    }

    return (
            <div className="custom-container-fluid">
                {/* Top container */}
                <div className="custom-row">
                    <div className="custom-col-md">
                        {/* Adjust the height as needed */}
                        <div className="custom-top-container" style={{ height: "50vh", backgroundColor: "#f8f9fa", padding: "20px" }}>
                            <Link to='/messages'>
                                <button variant="light" className='fa-brands fa-facebook-messenger float-end' style={{ border: '2px solid black', height: '4.5vh', width: '4.5vh' }}></button>
                            </Link>
                            <Link to='/settings'>
                                <Button variant="light" className="float-start" style={{ border: '2px solid black' }}>Settings</Button>
                            </Link>
                            <h1 style={{ fontFamily: 'Croissant One', fontSize: '8vh', marginRight: '30vh', marginBottom: '-10vh' }}>ELOGRAM</h1>
                            <Button variant="light" className="float-end" style={{ border: '2px solid black', marginRight: '2vh' }}>Followers: {filFollows.length}</Button>
                            <Button variant="light" className="float-end" style={{ marginRight: '2vh', border: '2px solid black' }}>Following: {filFollowing.length}</Button>
                            <Button variant="light" className="float-end" style={{ marginRight: '2vh', border: '2px solid black' }}>Posts: {feed.length}</Button>
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
                            <div style={{ marginTop: '2vh', marginBottom: '2vh' }}>
                                <h1 style={{ textAlign: 'left', fontSize: '4vh' }}>{profile?.first_name} {profile?.last_name}</h1>
                                <p style={{ marginBottom: '-0.5vh' }}>Contact Info:</p>
                                <p>{profile?.email}</p>
                                <hr />
                                <p style={{ marginTop: '2vh' }}>{profile?.bio}</p>
                            </div>
                            <hr />
                        </div>
                        <h2 style={{ textAlign: 'center', fontSize: '5vh', backgroundColor: 'rgb(86, 79, 79)', }}>My Posts</h2>
                    </div>
                    <div className="custom-posts-container" style={{
                        height: "100vh", width: '100%', display: "flex",
                        flexDirection: "row", flexWrap: 'wrap',
                        justifyContent: "space-evenly",
                        padding: "20px"
                    }}> {posts ? (
                        feed.map((document) => (
                            <div
                                key={document.id}
                                className="custom-post-card"
                            >
                                {/* <div className="custom-profile-pic-container">
                                    {profile?.profile_pic && (
                                        <img
                                            className="custom-profile-pic"
                                            src={profile.profile_pic}
                                            alt=""
                                        />
                                    )}
                                </div> */}
                                <img
                                    className="custom-post-img"
                                    src={document.document}
                                    alt=""
                                />
                                <div className="custom-post-details">
                                    <p className="custom-likes" >
                                        Likes: {document.likes}
                                        <br />
                                        <Button onClick={() => deletePost(document.id)}>Delete post</Button>
                                    </p>
                                    <p className="custom-description">{document.title}</p>
                                </div>
                            </div>
                        )) ) : (
                            <p>You haven't posted anything</p>
                        )}
                    </div>
                </div>
                <Navbar />
            </div>
    )
}
