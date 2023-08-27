import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TodoList from './components/todoList';
import AddTodo from './components/addTodo';
import EditTodo from './components/edit-todo';
import UserRegister from './components/userRegister';
import UserLogin from './components/userLogin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
        <Routes>
            <Route path='/todos' element={ <TodoList /> } />
            <Route path='/add-todo' element={ <AddTodo /> } />
            <Route path='/edit-todo/:id' element={ <EditTodo /> } />
            <Route path='/register-user' element={ <UserRegister /> } />
            <Route path='/login' element={ <UserLogin /> } />
        </Routes>
    </React.StrictMode>
  </BrowserRouter>
);