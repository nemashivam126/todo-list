import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import CustomModal from '../components/modalbox';

const PrivateRoute = ({ children }) => {
    const [cookies, ,removeCookie] = useCookies(['username', 'user-id']);
    const token = localStorage.getItem('token');
    const isAuthenticated = token && cookies['username'] && cookies['user-id'];
    const [showAlert, setShowAlert] = useState(false);

    const handleCloseModal = () => setShowAlert(false);
    const handleLoginAgain = () => {
        removeCookie('username');
        removeCookie('user-id');
        localStorage.removeItem('token');
    }

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
          (response) => response,
          (error) => {
            if (error.response && error.response.status === 401) {
              setShowAlert(true);
            }
            return Promise.reject(error);
          }
        );
        
        return () => {
          axios.interceptors.response.eject(interceptor);
        };
    }, []);

    return isAuthenticated ? (
        <>
            <CustomModal
                title={<>Unauthorized Access: <span className='text-danger'>401</span></>}
                showModal={showAlert}
                bodyText={"Your login session has expired. Please log in again to continue accessing our app."}
                handleClose={handleCloseModal}
                handleAction1={handleLoginAgain}
                buttonOneName={"Close"}
                buttonTwoName={"Login"}
                btnOneVariant={"secondary"}
                btnTwoVariant={"success"}
            />
            {children}
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default PrivateRoute;
