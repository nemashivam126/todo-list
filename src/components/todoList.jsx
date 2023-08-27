import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();
    const [cookies, ,removeCookie] = useCookies();
    const [user, setUser] = useState('');

    const loadTodos = () => {
        axios({
            method: 'get',
            url: 'http://localhost:5000/todos'
        }).then(res => {
            const todosWithCheckbox = res.data.map(todo => ({ ...todo, isChecked: false }));
            setTodos(todosWithCheckbox);
        });
    }

    useEffect(() => {
        if(cookies['username'] === undefined){
            navigate("/login");
          }else{
            loadTodos();
            setUser(cookies.username)
          }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const DeleteRecord = (id) => {
        axios({
            method: "delete",
            url: `http://localhost:5000/todos/delete/${id}`,
        }).then(() => {
            console.log(`deleted ${id}`);
        });
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this todo?");
        if (confirmDelete) {
            DeleteRecord(id);
        }
    };

    const handleSearch = (e) => {
        const searchedVal = e.target.value.toLowerCase();
        const filteredTodo = todos.filter((todo) => (
            todo.Title.toLowerCase().includes(searchedVal) || todo.Description.toLowerCase().includes(searchedVal)
        ));
        setFilteredTodos(filteredTodo);
        setSearchKey(searchedVal);
        setFlag(searchedVal !== '' && filteredTodo.length === 0);
    };

    const handleClick = () => {
        navigate('/add-todo')
    }

    const handleCheck = (id) => {
        setTodos(prevTodos => prevTodos.map(todo =>
            todo._id === id ? { ...todo, isChecked: !todo.isChecked } : todo
        ));
    };

    const handleSignOut = () => {
        if('username' in cookies){
            removeCookie('username');
            navigate("/login");
        }
    }

    return (
        <>
            <div>
                <div>
                    <nav className="d-flex justify-content-between align-items-center bg-dark text-white p-2">
                    <Link style={{textDecoration:"none", color:"white"}} to={'/todos'}><h1 className="mx-2 bi bi-pen">TODO's</h1></Link>
                        <div className="mx-2 d-flex">
                            <input type="search" className="form-control mx-3" onChange={handleSearch} placeholder="Search here...!" />
                            <h4 className="me-3">{user}</h4>
                            <div><button onClick={handleSignOut} className="btn btn-danger">Signout</button></div>
                        </div>
                    </nav>
                </div>
                <div className="d-flex justify-content-center align-items-center"><h1 className="text-center">Todo's</h1><button className="btn btn-primary bi bi-plus" onClick={handleClick} style={{position:"absolute", right:"100px"}}>Add Todo</button></div>
                <div className="text-center">
                    {flag ? (
                        <div className="todo mt-5 text-danger d-flex justify-content-center align-items-center" style={{height: '75vh' }}>
                            <div><h1 className="bi bi-exclamation-triangle"> No record found!</h1></div>
                        </div>
                    ) : (
                        <div className="todo mt-5" style={searchKey?{display:'flex', flexDirection:'column',alignItems:'center'}:{display:'grid', gridTemplateColumns: "12fr", justifyItems: 'center', margin:'100px', columnGap:'10px'}}>
                            {(filteredTodos.length > 0 ? filteredTodos : todos).map(todo =>
                                <div key={todo._id} className={`card m-1 ${todo.isChecked ? 'bg-success text-white' : ''}`}
                                    style={searchKey ? { display: 'flex', flexWrap: 'nowrap', width: '30%' } : { width: '100%' }}>
                                    <div className="card-header d-flex justify-content-center">
                                        <div style={{ position: "absolute", left: "15px" }}>
                                            <input onChange={() => handleCheck(todo._id)} className="form-check-input" type="checkbox" checked={todo.isChecked} name={todo.Title} />
                                            <span>{todo.isChecked ? " Completed" : " Mark as Complete"}</span>
                                        </div>
                                        <div><h5>Title: {todo.Title}</h5></div>
                                        <div style={{ position: "absolute", right: "15px" }}>
                                            <Link to={`/edit-todo/${todo._id}`}>
                                                <i><span className="bi bi-pen text-warning mx-2"></span></i>
                                            </Link>
                                            <i type="button" onClick={() => handleDelete(todo._id)}>
                                                <span className="bi bi-trash text-danger"></span>
                                            </i>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h5>Description: {todo.Description}</h5>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default TodoList;
