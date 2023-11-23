// Import the react JS packages
import { useEffect, useState } from "react";
import Navbar from "../NavBar/navbar";
import axios from "axios";
// Define the Login function.
const Home = () => {
    const [message, setMessage] = useState("");
    useEffect(() => {
        if (localStorage.getItem("access_token") === null) {
            window.location.href = "/login";
        } else {
            (async () => {
                try {
                    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/home/`, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                        },
                    });
                    setMessage(data.message);
                } catch (e) {
                    console.log("not auth");
                }
            })();
        }
    }, []);
    return (
        <div className="form-signin mt-5 text-center">
            <h3>Hi {message}</h3>
            <footer><Navbar /></footer>
        </div>
    );
};

export default Home;