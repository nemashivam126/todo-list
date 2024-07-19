import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar({ handleSearch, handleSignOut, user, search = true }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
      setIsOpen(!isOpen);
  };

  return (
      <div className="navbar flex bg-dark p-3" style={{ position: 'fixed', width: '100%', top: 0, zIndex: 1000 }}>
          <Link style={{ textDecoration: "none", color: "white" }} to={'/todos'}>
              <h1 className="bi bi-pen">TODO's</h1>
          </Link>
          <div className="menu-icon" onClick={toggleMenu}>
              <i className={`bi ${isOpen ? 'bi-x' : 'bi-list'}`}></i>
          </div>
          <div className={`menu ${isOpen ? 'open' : ''}`}>
              {search && (
                  <input
                      type="search"
                      className="form-control"
                      onChange={handleSearch}
                      placeholder="Search here..."
                      style={{ maxWidth: isOpen ? '100%' : '200px', marginRight: isOpen ? '0' : '10px' }}
                  />
              )}
              <h6 style={{ minWidth: isOpen ? '100%' : '100px', maxWidth: '150px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: isOpen ? '10px' : '0' }}>{user}</h6>
              <button onClick={handleSignOut} className="btn btn-outline-light" style={{ width: isOpen ? '95%' : '100px', marginLeft: isOpen ? '0' : '10px' }}>
                  <i className="bi bi-power"></i> Logout
              </button>
          </div>
      </div>
  );
}

export default Navbar;
