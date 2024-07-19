import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import TodoList from './components/todoList';
import AddTodo from './components/addTodo';
import EditTodo from './components/edit-todo';
import UserRegister from './components/userRegister';
import UserLogin from './components/userLogin';
import PrivateRoute from './HOC/PrivateRoute';
import PublicRoute from './HOC/PublicRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
        <Routes>
            <Route path='/' element={<Navigate to="/todos" />} />
            <Route path='/todos' element={ <PrivateRoute><TodoList /></PrivateRoute> } />
            <Route path='/add-todo' element={ <PrivateRoute><AddTodo /></PrivateRoute> } />
            <Route path='/edit-todo/:id' element={ <PrivateRoute><EditTodo /></PrivateRoute> } />
            <Route path='/register-user' element={ <PublicRoute><UserRegister /></PublicRoute> } />
            <Route path='/login' element={ <PublicRoute><UserLogin /></PublicRoute> } />
        </Routes>
    </React.StrictMode>
  </BrowserRouter>
);