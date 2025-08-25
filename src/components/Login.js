import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const { login, register, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isRegister) {
        result = await register(formData.email, formData.password);
      } else {
        result = await login(formData.email, formData.password);
      }

      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <i className="fas fa-user-shield fa-3x text-primary mb-3"></i>
            <h2 className="card-title">
              {isRegister ? 'Create Admin Account' : 'Admin Login'}
            </h2>
            <p className="text-muted">
              {isRegister ? 'Register your admin account' : 'Sign in to your account'}
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <i className="fas fa-envelope me-2"></i>
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                <i className="fas fa-lock me-2"></i>
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                minLength="6"
              />
              <div className="form-text">
                Password must be at least 6 characters long.
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {isRegister ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  <i className={`fas ${isRegister ? 'fa-user-plus' : 'fa-sign-in-alt'} me-2`}></i>
                  {isRegister ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              className="btn btn-link text-decoration-none"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setFormData({ email: '', password: '' });
              }}
            >
              {isRegister 
                ? 'Already have an account? Sign In' 
                : 'Need to create an admin account? Register'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
