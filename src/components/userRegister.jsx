import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie"; // Import useCookies
import BSToast from "./toast";
import BackdropSpinner from "./backdropSpinner";

function UserRegister() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [ , setCookie] = useCookies(['username', 'user-id']); // Initialize useCookies
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

    const handleRegister = async () => {
        if (!username || !email || !password) {
            setMessage("All fields are required.");
            setIcon('bi bi-exclamation-triangle-fill');
            setToastBg('danger');
            handleShowToast();
            return;
        }
        try {
            setLoader(true);
            const response = await axios({
                method: 'post',
                url: 'https://todo-backend-six-jet.vercel.app/users/register',
                data: {
                    username,
                    email,
                    password
                }
            });

            setCookie("username", response.data.user.username, { path: '/' });
            setCookie("user-id", response.data.user._id, { path: '/' });
            localStorage.setItem('token', response.data.token);
            setMessage("Successfully Registered In Todo Application!");
            setIcon('bi bi-check-circle-fill');
            setToastBg('success');
            handleShowToast();
            navigate('/todos');
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
                        <div className="text-center text-white h5"><b><i className="h1 bi bi-person-circle"></i></b></div>
                        <div className="text-center text-white mb-3 h5"><b>Sign Up</b></div>
                        <dt>User Name</dt>
                        <dd><input className="form-control" type="text" onChange={(e) => setUsername(e.target.value)} /></dd>
                        <dt>Email</dt>
                        <dd><input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} /></dd>
                        <dt>Password</dt>
                        <dd><input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} /></dd>
                        <div className="my-4">
                            <button className="btn btn-primary w-100" onClick={handleRegister}>Register</button>
                        </div>
                        {/* <div className="text-center text-danger">{message}</div> */}
                        <div className="text-center"><Link style={{ textDecoration: 'none', fontSize: '14px' }} to={'/login'}>Already a user? Sign in!</Link></div>
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
    )
}

export default UserRegister;
