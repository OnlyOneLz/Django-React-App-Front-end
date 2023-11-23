import axios from "axios";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const user = {
      username: username,
      password: password,
    };

    const { data } = await axios.post(
      "http://localhost:8000/token/",
      user,
      {
        headers: { "Content-Type": "application/json" },
      },
      {
        withCredentials: true,
      }
    );

    const token = data.access;
    const decoded = jwtDecode(token);

    localStorage.clear();
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    localStorage.setItem("user_url", decoded.user_id);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data["access"]}`;

    try {
      const response = await fetch(
        `http://localhost:8000/profile/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " +
              btoa(
                `${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASSWORD}`
              ),
          },
        }
      );
        const allProfiles = await response.json();

        // Check if any profile has a user_id that matches the decoded user_id
        const matchingProfile = allProfiles.find(
          (profile) => profile.user === decoded.user_id
        );
        console.log(matchingProfile);

      if (matchingProfile) {
          localStorage.setItem("profile_id", matchingProfile.id);
          navigate("/profile");
      }
      else if (response.status === 404) {
        // Profile not found, redirect to create_profile
        navigate("/create_profile");
      }else {
        navigate("/create_profile");

      }
    } catch (error) {
      console.log("Error fetching profile", error);
    }
  };
  return (
    <div className="log-Auth-form-container">
      <h3 className="log-Auth-form-title"
      style={{
        marginLeft: '5vh',
        paddingLeft: '55vh',
        paddingTop: '5vh',
        marginBottom: '-5vh',
        color: 'black'
      }}>Sign In</h3>
      <form className="log-Auth-form" onSubmit={submit}>
        <div className="log-Auth-form-content">
          <div className="log-form-group mt-3">
            <label>Username</label>
            <input
              className="log-form-control mt-3"
              placeholder="Enter Username"
              name="username"
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="logform-group mt-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-control mt-3"
              placeholder="Enter password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="log-d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" style={{color: 'black'}}>
              Submit
            </button>
          </div>
        </div>
        <p>
        If new to Elogram, click{" "}
        <Link to="/signup">HERE</Link> to sign up
      </p>
      </form>
    </div>
  );
}