import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import '../styles/style.css'; // Import the CSS file
import Navbar from "./navbar";
import BSToast from "./toast";
import BackdropSpinner from "./backdropSpinner";
import CustomModal from "./modalbox";

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [todosCheck, setTodosCheck] = useState(null);
    const [searchKey, setSearchKey] = useState('');
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();
    const [cookies, ,removeCookie] = useCookies();
    const [user, setUser] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('You are using todo application by Shivam Nema! Thank you.');
    const [toastBg, setToastBg] = useState('primary');
    const [icon, setIcon] = useState('');
    const [loader, setLoader] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [deleteTitle, setDeleteTitle] = useState(null);
    const [todoToDelete, setTodoToDelete] = useState(null);

    const loadTodos = () => {
        setLoader(true);
        axios.get('https://todo-backend-six-jet.vercel.app/todos', {
            headers: {
                Token: `Bearer ${localStorage.getItem('token')}` // Set Authorization header
            }
        })
        .then(res => {
            const todosWithCheckbox = res.data.map(todo => ({ ...todo, isChecked: todo.isComplete }));
            setTodos(todosWithCheckbox);
            setTodosCheck(todosWithCheckbox);
        })
        .catch(error => {
            console.error("Error loading todos:", error);
        }).finally(() => {
            setLoader(false)
        });
    };

    useEffect(() => {
        if(cookies['username'] === undefined){
            navigate("/login");
          }else{
            loadTodos();
            setUser(cookies.username)
          }
    }, [cookies, navigate]);

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
        navigate('/add-todo')
    }

    const handleCheck = (id) => {
        const todoToUpdate = todos.find(todo => todo._id === id);
        const updatedTodo = { ...todoToUpdate, isChecked: !todoToUpdate.isChecked, isComplete: !todoToUpdate.isChecked };
        setLoader(true);
        axios.put(`https://todo-backend-six-jet.vercel.app/todos/update/${id}`, updatedTodo, {
            headers: {
                Token: `Bearer ${localStorage.getItem('token')}` // Set Authorization header
            }
        })
        .then(response => {
            const todoToUpdate = todos.find(todo => todo._id === id);
            setTodos(prevTodos => prevTodos.map(todo =>
                todo._id === id ? { ...todo, isChecked: !todo.isChecked, isComplete: !todo.isChecked } : todo
            ));
            if (!todoToUpdate.isComplete) {
                setToastMsg('Todo successfully marked as complete.');
                setIcon('bi bi-check-circle-fill');
                setToastBg('success');
            } else {
                setToastMsg('Todo successfully unmarked as complete.');
                setIcon('bi bi-check-circle-fill');
                setToastBg('warning');
            }
            handleShowToast();
            loadTodos();
        })
        .catch(error => {
            console.error("Error updating todo:", error);
            setIcon('bi bi-exclamation-triangle-fill')
        }).finally (() => {
            setLoader(false)
        });
    };

    const handleSignOut = () => {
        if('username' in cookies){
            removeCookie('username');
            removeCookie('user-id');
            localStorage.removeItem('token');
            navigate("/login");
        }
    }

    const handleShowToast = () => {
        setShowToast(true);
    };
    
    const handleCloseToast = () => {
        setShowToast(false);
    };

    return (
        <>
            <div>
                <div style={{position: 'relative', marginBottom: '80px', zIndex: 1}}>
                    <Navbar handleSearch={handleSearch} handleSignOut={handleSignOut} user={user} />
                </div>
                <div className="container">
                    <div className="header">
                        <h1>Todo's</h1>
                        <button title="Add Todo" className="btn" onClick={handleClick}><i style={{marginTop: '8px'}} className="h1 bi bi-plus-circle-fill"></i></button>
                    </div>
                    <div className="card-container">
                        { todosCheck && todosCheck.length === 0 ? 
                        (<div className="todo text-danger d-flex justify-content-center align-items-center" style={{height: '50vh' }}>
                            <h4 className="bi bi-exclamation-triangle"> Your to-do list is empty! Start adding tasks and get organized. </h4>
                        </div>)
                        :
                        flag ? (
                            <div className="todo text-danger d-flex justify-content-center align-items-center" style={{height: '50vh' }}>
                                <h4 className="bi bi-exclamation-triangle"> No record found!</h4>
                            </div>
                        ) : (
                            (filteredTodos.length > 0 ? filteredTodos : todos).map(todo =>
                                <div key={todo._id} className={`card ${todo.isComplete ? 'completed' : ''}`}>
                                    <div className="card-header">
                                        <input 
                                            title="Mark as complete"
                                            onChange={() => handleCheck(todo._id)} 
                                            type="checkbox" 
                                            checked={todo.isChecked} 
                                        />
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
                            )
                        )}
                    </div>
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
        </>
    );
}

export default TodoList;
