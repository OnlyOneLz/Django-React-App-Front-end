import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/NavBar/navbar";

export default function AddPost() {
  const navigate = useNavigate()

  const [imageTitle, setImageTitle] = useState('')
  const [image, setImage] = useState(null)

  const profileId = localStorage.getItem("profile_id");

  const handleChange = (e) => {
    setImageTitle(e.target.value);
  };

  const handleImageChange = (e) => {
    // var fileExt = e.target.files[0].name.split('.').pop();
    // e.target.files[0].name = uuidv4() + fileExt;
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log( imageTitle, image, profileId);
    const body = {
      title: imageTitle,
      document: image,
      profile: profileId
    }

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/add_media/`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
      )
      .then((res) => {
        console.log(res.data);
        navigate('/feed')
      })
      .catch((err) => console.log(err));

  };
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <p>
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            required
          />
        </p>
        <p>
          <input
            type="text"
            placeholder="Description"
            id="title"
            value={imageTitle}
            onChange={handleChange}
            required
          />
        </p>
        <input type="submit" />
      </form>
      <footer><Navbar /></footer>
    </div>
  );
};

