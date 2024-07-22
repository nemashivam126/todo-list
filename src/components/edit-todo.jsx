import axios from "axios";
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "./navbar";
import BSToast from "./toast";
import BackdropSpinner from "./backdropSpinner";

const EditTodo =()=> {
    const [data, setData] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const [cookies, ,removeCookie] = useCookies()
    const [user, setUser] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('You are using todo application by Shivam Nema! Thank you.');
    const [toastBg, setToastBg] = useState('primary');
    const [icon, setIcon] = useState('');
    const [loader, setLoader] = useState(false);

    const handleSubmit = (e) =>{
        e.preventDefault();
        UpdateData();
    }
    const handleTitleChange=(e)=>{
        setData((prevdata)=>({
            ...prevdata,
            Title: e.target.value,
            isComplete: false, 
        }))
    }
    const handleDescChange=(e)=>{
        setData((prevData)=>({
            ...prevData,
            Description:e.target.value,
            isComplete: false, 
        }))
    }

    const handleShowToast = () => {
        setShowToast(true);
    };
    
    const handleCloseToast = () => {
        setShowToast(false);
    };

    const UpdateData = async () => {
        setLoader(true);
        try {
            // Update data request
            const response = await axios({
                method: 'put',
                url: `https://todo-backend-six-jet.vercel.app/todos/update/${params.id}`,
                data: data,
                headers: {
                    Token: `Bearer ${localStorage.getItem('token')}` // Set Authorization header
                }
            });
    
            if (response.status === 200) {
                setToastMsg('Data updated successfully!');
                setIcon('bi bi-check-circle-fill');
                setToastBg('success');
                handleShowToast();
                setTimeout(() => {
                    navigate('/todos');
                }, 1000);
            }
        } catch (error) {
            console.error(error);
            setToastMsg('Failed to update data.');
            setIcon('bi bi-exclamation-triangle-fill');
            setToastBg('danger');
            handleShowToast();
        } finally {
            setLoader(false);
        }
    };

    const loadtodo = () => {
        setLoader(true);
        axios({
            method: 'get',
            url: `https://todo-backend-six-jet.vercel.app/todos/${params.id}`,
            headers: {
                Token: `Bearer ${localStorage.getItem('token')}` // Set Authorization header
            }
        }).then((response)=>{
            setData(response.data)
            console.log(response.data);
        }).finally(() => {
            setLoader(false);
        })
    }

    useEffect(()=>{
        if(cookies['username'] === undefined){
            navigate("/login");
          }else{
            loadtodo();
            setUser(cookies.username)
          }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const handleSignOut = (e) => {
        e.preventDefault()
        if('username' in cookies){
            removeCookie('username');
            removeCookie('user-id');
            localStorage.removeItem('token');
            navigate("/login");
        }
    }

    return(
        <div>
            <div style={{position: 'relative', marginBottom: '100px', zIndex: 1}}>
                    <Navbar search={false} handleSignOut={handleSignOut} user={user} />
                </div>
            <div className="d-flex justify-content-center mt-5">
                <form onSubmit={handleSubmit} className="bg-dark text-white p-4 rounded-3 ">
                    <div className="form-group">
                        <label>Title</label>
                        <input onChange={handleTitleChange} className="form-control" type="text" name="Title" value={data.Title} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea onChange={handleDescChange} className="form-control" name="description" value={data.Description} cols="30" rows="3"></textarea>
                    </div>
                    <div className="form-group mt-2">
                        <button className="btn btn-warning w-100">Update</button>
                    </div>
                </form>
            </div>
            <div className="text-center mt-5"><Link to='/todos'><button className="btn btn-secondary">Back</button></Link></div>
            <BSToast
                bgColor={toastBg}
                icon={icon}
                show={showToast}
                onClose={handleCloseToast}
                message={toastMsg}
            />
            <BackdropSpinner show={loader} onHide={loader} />
        </div>
    )
}

export default EditTodo