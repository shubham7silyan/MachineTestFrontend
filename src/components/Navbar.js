import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-chart-line me-2"></i>
          Shubham Silyan Dashboard
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                <i className="fas fa-home me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/agents')}`} to="/agents">
                <i className="fas fa-users me-1"></i>
                Agents
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/lists')}`} to="/lists">
                <i className="fas fa-file-csv me-1"></i>
                Lists
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle btn btn-link text-white text-decoration-none border-0" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
                style={{background: 'transparent'}}
              >
                <i className="fas fa-user me-1"></i>
                {currentUser?.email || 'Admin'}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
