import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import "../styles/style.css"; // Import the CSS file
import BSToast from "./toast";
import BackdropSpinner from "./backdropSpinner";
import CustomModal from "./modalbox";

const AddTodo = () => {
    const [task, setTask] = useState({ Title: "", Description: "" });
    const [todos, setTodos] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [filteredTodos, setFilteredTodos] = useState([]);
    const navigate = useNavigate();
    const [flag, setFlag] = useState(false);
    const [cookies, , removeCookie] = useCookies();
    const [user, setUser] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('You are using todo application by Shivam Nema! Thank you.');
    const [toastBg, setToastBg] = useState('primary');
    const [icon, setIcon] = useState('');
    const [loader, setLoader] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [deleteTitle, setDeleteTitle] = useState(null);
    const [todoToDelete, setTodoToDelete] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        PostTask();
        setTask({ Title: "", Description: "" });
    };

    const handleTitleChange = (e) => {
        setTask((prevTask) => ({
            ...prevTask,
            Title: e.target.value
        }));
    };

    const handleDescChange = (e) => {
        setTask((prevTask) => ({
            ...prevTask,
            Description: e.target.value
        }));
    };

    const PostTask = async () => {
        setLoader(true);
        try {
            const response = await axios({
                method: "post",
                url: "https://todo-backend-six-jet.vercel.app/todos/submit",
                data: task,
                headers: {
                    Token: `Bearer ${localStorage.getItem('token')}` // Set Authorization header
                }
            });
    
            console.log(response.data);
            setToastMsg(`You have successfully added a todo: "${response.data?.Title}"`);
            setIcon('bi bi-check-circle-fill');
            setToastBg('success');
            handleShowToast();
            // Use setTimeout to delay the toast display
            setTimeout(() => {
                navigate('/todos');
            }, 1000);
        } catch (error) {
            console.error(error);
            setToastMsg(`Something went wrong. Please try again!`);
            setIcon('bi bi-exclamation-triangle-fill');
            setToastBg('danger');
            handleShowToast();
        } finally {
            setLoader(false);
        }
    };

    const loadTodos = () => {
        setLoader(true);
        try {
            axios({
                method: "get",
                url: "https://todo-backend-six-jet.vercel.app/todos",
                headers: {
                    Token: `Bearer ${localStorage.getItem('token')}` // Set Authorization header
                }
            }).then((res) => {
                setTodos(res.data);
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        if (cookies['username'] === undefined) {
            navigate("/login");
        } else {
            loadTodos();
            setUser(cookies.username);
        }
    }, [navigate, cookies]);

    const DeleteRecord = async () => {
        if (todoToDelete) {
            setLoader(true);
            try {
                await axios({
                    method: "delete",
                    url: `https://todo-backend-six-jet.vercel.app/todos/delete/${todoToDelete}`,
                    headers: {
                        Token: `Bearer ${localStorage.getItem('token')}` // Set Authorization header
                    }
                });
                console.log(`deleted ${todoToDelete}`);
                const todoToDeleteItem = todos.find(todo => todo._id === todoToDelete);
                setTodos(prevTodos => prevTodos.filter(todo => todo._id !== todoToDelete));
                setFilteredTodos(prevFilteredTodos => prevFilteredTodos.filter(todo => todo._id !== todoToDelete));
                setToastMsg(todoToDeleteItem ? `Successfully deleted todo: "${todoToDeleteItem.Title}"` : 'Successfully deleted todo.');
                setIcon('bi bi-trash-fill');
                setToastBg('danger');
                loadTodos();
                handleShowToast();
            } catch (error) {
                console.error("Error deleting todo:", error);
                setToastMsg('Failed to delete todo. Please try again!');
                setIcon('bi bi-exclamation-triangle-fill'); // Error icon
                setToastBg('danger'); // Assuming 'error' should be 'danger'
                handleShowToast();
            } finally {
                setLoader(false);
                setDeleteAlert(false);
                setTodoToDelete(null); // Clear the todo id
            }
        }
    };

    const handleCloseModal = () => setDeleteAlert(false);
    const handleDeleteModal = (id) => {
        setTodoToDelete(id); // Set the id of the todo to delete
        const todoToDelete = todos.find(todo => todo._id === id);
        setDeleteTitle(todoToDelete?.Title);
        setDeleteAlert(true);
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
        navigate('/todos');
    };

    const handleSignOut = () => {
        if ('username' in cookies) {
            removeCookie('username');
            removeCookie('user-id');
            localStorage.removeItem('token');
            navigate("/login");
        }
    };

    const handleShowToast = () => {
        setShowToast(true);
    };
    
    const handleCloseToast = () => {
        setShowToast(false);
    };

    return (
        <div>
            <div style={{position: 'relative', marginBottom: '100px', zIndex: 1}}>
                <Navbar handleSearch={handleSearch} handleSignOut={handleSignOut} user={user} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
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
                <div className="card-container">
                    {searchKey && (flag ? (
                        <div className="todo text-danger d-flex justify-content-center align-items-center" style={{height: '50vh' }}>
                            <h4 className="bi bi-exclamation-triangle"> No record found!</h4>
                        </div>
                    ) : (
                        (filteredTodos.length > 0) ? filteredTodos.map(todo =>
                            <div key={todo._id} className={`card ${todo.isComplete ? 'completed' : ''}`}>
                                <div className="card-header">
                                    <h5 style={todo.isComplete ? {textDecoration: 'line-through'} : {}}>{todo.Title}</h5>
                                    {todo.isComplete && <span className="completed-chip">Completed</span>}
                                    <div className="actions">
                                        <Link to={`/edit-todo/${todo._id}`}>
                                            <i className="bi bi-pen text-warning"></i>
                                        </Link>
                                        <i onClick={() => handleDeleteModal(todo._id)} className="bi bi-trash text-danger"></i>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <h5 style={todo.isComplete ? {textDecoration: 'line-through'} : {}}>Description: {todo.Description}</h5>
                                </div>
                                <div style={todo.isComplete ? {backgroundColor: '#28a745', color: 'white'} : {}} className="card-footer">
                                    <small>{todo.createdAt === todo.updatedAt ? `Created At:` : `Updated At:`} {new Date(todo.createdAt === todo.updatedAt ? todo.createdAt : todo.updatedAt).toLocaleString()}</small>
                                    {/* <small>Updated At: {new Date(todo.updatedAt).toLocaleString()}</small> */}
                                </div>
                            </div>
                        ) : null
                    ))}
                </div>
            </div>
            <BSToast
                bgColor={toastBg}
                icon={icon}
                show={showToast}
                onClose={handleCloseToast}
                message={toastMsg}
            />
            <CustomModal
                title={`Delete Todo "${deleteTitle}"?`}
                showModal={deleteAlert}
                bodyText={`Are you sure you want to delete this todo "${deleteTitle}"?`}
                handleClose={handleCloseModal}
                handleAction1={DeleteRecord}
                buttonOneName={"Cancel"}
                buttonTwoName={"Delete"}
                btnOneVariant={"secondary"}
                btnTwoVariant={"danger"}
            />
            <BackdropSpinner show={loader} onHide={loader} />
        </div>
    );
}

export default AddTodo;
