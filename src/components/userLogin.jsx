import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function UserLogin() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [ ,setCookie] = useCookies(['user-id','userName'])

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/users/login", {
                username,
                email
            });

            if (response.status === 200) {
                setCookie("username", username)
                navigate("/todos");
            } else {
                setMessage(response.data.message)
            }
        } catch (error) {
            console.error("An error occurred during login:", error);
        }
    };

    return (
        <div style={{ fontSize: "30px" }}>
            <div className="container text-white">
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <dl className="p-5 bg-dark rounded-4">
                        <div className="text-center text-white"><b>Login User</b></div>
                        <dt>User Name</dt>
                        <dd><input className="form-control" type="text" style={{ fontSize: "30px" }} onChange={(e) => setUsername(e.target.value)} /></dd>
                        <dt>Email</dt>
                        <dd><input type="email" className="form-control" style={{ fontSize: "30px" }} onChange={(e) => setEmail(e.target.value)} /></dd>
                        <div className="my-5">
                            <button className="btn btn-primary w-100" style={{ fontSize: "30px" }} onClick={handleLogin}>Login</button>
                        </div>
                        <div className="text-center text-danger">{message}</div>
                    </dl>
                </div>
            </div>
        </div>
    )
}

export default UserLogin;
