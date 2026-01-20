import { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:8080/auth/login", loginData);


            const jwtToken = res.data.jwtToken;
            const roles = res.data.roles;


            // Store user data in localStorage
            localStorage.setItem("username", loginData.username);
            localStorage.setItem("password", loginData.password); // not recommended
            localStorage.setItem("jwtToken", jwtToken);
            localStorage.setItem("roles", roles);



            toast.success("Login Successful!");
            if (roles === "USER") {
                navigate("/dashboard");
            } else if (roles === "EMPLOYEE") {
                navigate("/employeePanel");
            } else {
                navigate("/adminPanel");
            }


        } catch (error) {
            console.error("Login Error:", error);
            toast.error("Invalid username or password!");
        }
    };

    return (
        <div className="signup-box">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    onChange={handleChange}
                    required
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
