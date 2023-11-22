import axios from "axios";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

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

        if (matchingProfile) {
          localStorage.setItem("profile_id", matchingProfile.id);
          navigate("/profile");
        }

      if (response.status === 404) {
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
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={submit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              className="form-control mt-1"
              placeholder="Enter Username"
              name="username"
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>

      <p>
        If new to Elogram, click{" "}
        <Link to="/signup">HERE</Link> to sign up
      </p>
    </div>
  );
}