import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Logout } from "../../components/logout/logout";
import "./Settings.css"

export default function Settings() {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    bio: "",
    profile_pic: '',
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem("profile_id");
  const userUrl = localStorage.getItem("user_url");

  useEffect(() => {
    const userId = localStorage.getItem("profile_id");
    async function getProfile() {
      try {
        const response = await fetch(`http://localhost:8000/profile/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const result = await response.json();

        // Set the initial state of profile_pic to the URL if it exists
        setProfile((prevProfile) => ({
          ...prevProfile,
          profile_pic: result.profile_pic || null,
        }));

        // Set the rest of the profile data
        setProfile(result);
        console.log(result);
      } catch (error) {
        console.log("User not found", error);
      }
    }
    getProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Check if the file input is cleared and reset the profile picture
    if (!file) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        profile_pic: null,
      }));
      console.log('HITTTT');
      return;
    }

    // Create an object URL for the uploaded file
    const objectURL = URL.createObjectURL(file);

    // Create an Image element to get the image dimensions
    const img = new Image();
    img.src = objectURL;

    img.onload = () => {
      // Check if the image is a perfect circle (aspect ratio is 1:1)
      if (img.width === img.height) {
        // Set the profile picture
        setProfile((prevProfile) => ({
          ...prevProfile,
          profile_pic: file,
        }));
      } else {
        // Alert the user that the image should be a perfect circle
        alert('Please upload an image with a 1:1 aspect ratio (width equals height) for a perfect circle.');
      }
    };
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("first_name", profile.first_name);
      formData.append("last_name", profile.last_name);
      formData.append("dob", profile.dob);
      formData.append("email", profile.email);
      formData.append("bio", profile.bio);
      formData.append("profile_pic", profile.profile_pic);

      console.log(formData);

      const response = await fetch(`http://localhost:8000/profile/${profile.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Profile updated successfully");
        navigate("/profile")
        // Optionally, you can redirect the user or perform other actions upon successful update
      } else {
        console.log("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  async function deleteProfile() {
    try {
      const response = await fetch(`http://localhost:8000/profile/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.ok) {
        console.log('Profile Deleted');
      }
    } catch (error) {
      console.log("User not found", error);
    }
    try {
      const response = await fetch(`http://localhost:8000/userDelete/${userUrl}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.ok) {
        console.log('User Deleted');
      }
    } catch (error) {
      console.log("User not found", error);
    }
    navigate('/login')
  }
  const pic = profile?.profile_pic
  console.log(pic);

  return (
      <form onSubmit={handleSubmit}>
        <div className="profile-pic-container">
          <Link to='/profile'>
            <Button variant="Dark" style={{ border: '2px solid black' }} className="float-start">Back</Button>
          </Link>
          <h1>Settings</h1>
          {profile?.profile_pic && typeof profile.profile_pic === "string" ? (
            <img src={profile.profile_pic} alt="Profile Pic" className="profile-pic" />
          ) : profile?.profile_pic instanceof File ? (
            <img src={URL.createObjectURL(profile.profile_pic)} alt="Profile Pic" className="profile-pic" />
          ) : null}
          <label>
            Change Profile Picture:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={profile.first_name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={profile.last_name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Date of Birth:
          <input
            type="text"
            name="dob"
            value={profile.dob}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Bio:
          <input
            type="text"
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <Button type="submit" style={{ border: '2px solid black', marginBottom: '1vh' }}>Update Profile</Button>
        <Button onClick={deleteProfile} style={{ border: '2px solid black', marginBottom: '1vh' }}>Delete Profile</Button>
        <hr />
        <Link to='/logout'>
            <Button variant="Dark" style={{ border: '2px solid black' }} >Logout</Button>
          </Link>
      </form>
  );
}
