import axios from "axios";
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

const AddTodo =()=> {
    const [task, setTask] = useState({Title:"", Description:""});
    const [todos, setTodos] = useState([])
    const [searchKey , setSearchKey] = useState('')
    const [filteredTodos, setFilteredTodos] = useState([]);
    const navigate = useNavigate()
    let [flag, setFlag] = useState(false)
    const [cookies, ,removeCookie] = useCookies();
    const [user, setUser] = useState('');
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(task);
        Posttask();
        setTask({ Title: "", Description: "" });
    }
    const handleTitleChange=(e)=>{
        setTask((prevtask)=>({
            ...prevtask,
            Title: e.target.value
        }))
    }
    const handleDescChange=(e)=>{
        setTask((prevtask)=>({
            ...prevtask,
            Description:e.target.value
        }))
    }
    const Posttask = () => {
        axios({
            method: "post",
            url: "http://localhost:5000/todos/submit",
            data: task
        }).then((res)=>{
            console.log(res.data)
        });
    }

    const loadTodos = () => {
        axios({
            method: "get",
            url: "http://localhost:5000/todos"
        }).then((res)=>{
            setTodos(res.data);
        })
    }

    useEffect(()=>{
        if(cookies['username'] === undefined){
            navigate("/login");
          }else{
            loadTodos();
            setUser(cookies.username)
          }
    },[navigate, cookies, todos])


    const DeleteRecord = (id) => {
        axios({
            method: "delete",
            url: `http://localhost:5000/todos/delete/${id}`,
          }).then(()=>{
              console.log(`deleted ${id}`);
          });
    }
    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this todo?");
        if (confirmDelete) {
            DeleteRecord(id);
        }
    };
    const handleSearch = (e) => {
        const searchedVal = e.target.value.toLowerCase();
        const filteredTodo = todos.filter((todo) => (
            todo.Title.toLowerCase().includes(searchedVal)|| todo.Description.toLowerCase().includes(searchedVal)
        ));
        setFilteredTodos(filteredTodo);
        setSearchKey(searchedVal);
        setFlag(searchedVal !== '' && filteredTodo.length === 0);
    }
    const handleClick = () => {
        navigate('/todos')
    }

    const handleSignOut = () => {
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
                    <div className="d-flex mx-2">
                        <input type="search" className="form-control mx-3" onChange={handleSearch} placeholder="Search here...!" />
                        <h4 className="me-3">{user}</h4>
                        <div><button onClick={handleSignOut} className="btn btn-danger">Signout</button></div>
                    </div>
                </nav>
            </div>
            <div className="p-1"><button onClick={handleClick} className="btn btn-primary float-end mx-5">View List</button></div>
            {searchKey?null:<div className="d-flex justify-content-center mt-5">
                <form onSubmit={handleSubmit} action="post" className="bg-secondary text-white p-4 " style={{borderRadius: '10px'}}>
                    <div className="form-group">
                        <label>Title</label>
                        <input onChange={handleTitleChange} className="form-control" type="text" name="title" value={task.Title} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea onChange={handleDescChange} className="form-control" name="description" value={task.Description} cols="30" rows="3"></textarea>
                    </div>
                    <div className="form-group mt-2">
                        <button className="btn btn-dark w-100">Add Todo</button>
                    </div>
                </form>
            </div>}
            {
                flag?(
                    <div className="todo mt-5 text-danger d-flex justify-content-center align-items-center" style={{height:'75vh'}}>
                        <div><h1 className="bi bi-exclamation-triangle"> No record found!</h1></div>
                    </div>
                ):(
                    <div className="todo mt-5 text-center" style={searchKey?{display:'flex', flexDirection:'column',alignItems:'center'}:{display:'grid', gridTemplateColumns: "12fr", justifyItems: 'center', margin:'100px', columnGap:'10px'}}>
                        {
                            (filteredTodos.length>0?filteredTodos:todos).map(todo=>
                                <div key={todo._id} className="card m-1" style={searchKey?{display:'flex',flexWrap:'nowrap', width:'30%'}:{width:'100%'}}>
                                    <div className="card-header d-flex justify-content-center">
                                        <div><h5>Title: {todo.Title}</h5></div>
                                        <div style={{position:"absolute", right:"15px"}}>
                                            <Link to={`/edit-todo/${todo._id}`}><i><span className="bi bi-pen text-warning mx-2"></span></i></Link>
                                            <i type="button" onClick={() => handleDelete(todo._id)}><span className="bi bi-trash text-danger"></span></i>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h5>Description: {todo.Description}</h5>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default AddTodo