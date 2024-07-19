import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import BSToast from "./toast";
import BackdropSpinner from "./backdropSpinner";

function UserLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [, setCookie] = useCookies(['user-id', 'username']);
    const [showToast, setShowToast] = useState(false);
    const [toastBg, setToastBg] = useState('primary');
    const [icon, setIcon] = useState('');
    const [loader, setLoader] = useState(false);

    const handleShowToast = () => {
        setShowToast(true);
    };
    
    const handleCloseToast = () => {
        setShowToast(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoader(true);
        try {
            const response = await axios.post("https://todo-backend-six-jet.vercel.app/users/login", {
                email,
                password
            });

            if (response.status === 200) {
                setCookie("username", response.data.user.username, { path: '/' });
                setCookie("user-id", response.data.user._id, { path: '/' });
                localStorage.setItem('token', response.data.token);
                setMessage("Successfully Logged In!");
                setIcon('bi bi-check-circle-fill');
                setToastBg('success');
                handleShowToast();
                navigate("/todos");
            } else {
                setMessage(response.data.message || "Login failed");
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "An error occurred during login");
            setIcon('bi bi-exclamation-triangle-fill');
            setToastBg('danger');
            handleShowToast();
        } finally {
            setLoader(false);
        }
    };

    return (
        <div>
            <div className="container text-white">
                <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh", flexDirection: 'column' }}>
                    <dl className="px-5 py-4 bg-dark rounded">
                        <div className="text-center text-white"><b><i className="h1 bi bi-person-circle"></i></b></div>
                        <div className="text-center text-white mb-2 h5"><b>Sign In</b></div>
                        <dt>Email</dt>
                        <dd><input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} /></dd>
                        <dt>Password</dt>
                        <dd><input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} /></dd>
                        <div className="my-4">
                            <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
                        </div>
                        {/* <div className="text-center text-danger">{message}</div> */}
                        <div className="text-center"><Link style={{textDecoration: 'none', fontSize: '14px'}} to={'/register-user'}>Not a user? Sign up here!</Link></div>
                    </dl>
                </div>
            </div>
            <BSToast
                bgColor={toastBg}
                icon={icon}
                show={showToast}
                onClose={handleCloseToast}
                message={message}
            />
            <BackdropSpinner show={loader} onHide={loader} />
        </div>
    );
}

export default UserLogin;
