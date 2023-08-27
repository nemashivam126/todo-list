import axios from "axios";
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie";
import { useNavigate, useParams, Link } from "react-router-dom";

const EditTodo =()=> {
    const [data, setData] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const [cookies, ,removeCookie] = useCookies()
    const [user, setUser] = useState('');

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(data);
        UpdateData();
        navigate('/todos');
    }
    const handleTitleChange=(e)=>{
        setData((prevdata)=>({
            ...prevdata,
            Title: e.target.value
        }))
    }
    const handleDescChange=(e)=>{
        setData((prevData)=>({
            ...prevData,
            Description:e.target.value
        }))
    }
    const UpdateData = () => {
        axios({
            method: 'put',
            url: `http://127.0.0.1:5000/todos/update/${params.id}`,
            data: data
        }).then(response => {
            if (response.status === 200) {
              alert('Data updated successfully!');
            }
        })
    }

    const loadtodo = () => {
        axios({
            method: 'get',
            url: `http://localhost:5000/todos/${params.id}`
        }).then((response)=>{
            setData(response.data[0])
            console.log(response.data);
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
            navigate("/login");
        }
    }

    return(
        <div>
            <div>
                <nav className="d-flex justify-content-between align-items-center bg-dark text-white p-2">
                    <Link style={{textDecoration:"none", color:"white"}} to={'/todos'}><h1 className="mx-2 bi bi-pen">TODO's</h1></Link>
                    <div className="d-flex"><h4 className="me-3">{user}</h4><button onClick={handleSignOut} className="btn btn-danger mx-2">Signout</button></div>
                </nav>
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
        </div>
    )
}

export default EditTodo