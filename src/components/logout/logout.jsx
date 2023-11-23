import { useEffect } from "react";
import axios from "axios";

export const Logout = () => {
    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/logout/`,
                    {
                        refresh_token: localStorage.getItem("refresh_token"),
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                        }
                    }
                );

                // Clear local storage
                localStorage.clear();

                // Remove the Authorization header for future requests
                axios.defaults.headers.common["Authorization"] = null;

                // Redirect to the login page
                window.location.href = "/login";
            } catch (e) {
                console.error("Logout not working", e);
            }
        };

        logout();
    }, []);

    return null; // You can return null as this component doesn't render anything
};
