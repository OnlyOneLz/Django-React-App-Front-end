import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateProfile.css";


export default function CreateProfile() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const navigate = useNavigate()

    const createProfile = async () => {
        try {
            const formData = new FormData();
            formData.append("first_name", firstName);
            formData.append("last_name", lastName);
            formData.append("dob", dob);
            formData.append("email", email);
            formData.append("bio", bio);
            formData.append("user", parseInt(localStorage.getItem("user_url")));
            formData.append("profile_pic", profilePic);

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/create_profile/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: formData,
            });

            if (response.ok) {
                const profileData = await response.json();
                console.log("Profile created successfully:", profileData);

                localStorage.setItem("profile_id", profileData.id);
                navigate("/profile");
            } else {
                console.log("Failed to create Profile");
            }
        } catch (error) {
            console.error("Error creating Profile", error);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        createProfile();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePic(file);
    };

    return (
        <div className="container">
        <div className="form-container" onSubmit={handleSubmit}>
        <div className="form-content">
            <h1 className="form-title">Sign up</h1>
            <form onSubmit={handleSubmit}>
                <br />
                <label>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    LastName:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </label>
                <label>
                    DateOfBirth:
                    <input
                        type="number"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    email:
                    <input
                        type="texy"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Bio:
                    <input
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Profile Picture:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
                <br />
                <button type="submit">Create </button>
            </form>
        </div>
        </div>
    </div>
    );
}