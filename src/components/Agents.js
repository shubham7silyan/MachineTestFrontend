import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get('/api/agents');
      setAgents(response.data.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await axios.post('/api/agents', formData);
      
      if (response.data.success) {
        setSuccess('Agent added successfully!');
        setFormData({ name: '', email: '', mobile: '', password: '' });
        fetchAgents();
        setTimeout(() => {
          setShowModal(false);
          setSuccess('');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding agent');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', mobile: '', password: '' });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 mb-0">
            <i className="fas fa-users me-2"></i>
            Agent Management
          </h1>
          <p className="text-muted">Manage your agents and their information</p>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Add Agent
          </button>
        </div>
      </div>

      {agents.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-user-plus fa-3x text-muted mb-3"></i>
            <h5>No Agents Found</h5>
            <p className="text-muted">Get started by adding your first agent</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <i className="fas fa-plus me-2"></i>
              Add First Agent
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          {agents.map((agent) => (
            <div key={agent._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card agent-card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <h5 className="card-title mb-0">{agent.name}</h5>
                      <small className="text-muted">
                        {agent.isActive ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-secondary">Inactive</span>
                        )}
                      </small>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <i className="fas fa-envelope text-muted me-2"></i>
                    <small>{agent.email}</small>
                  </div>
                  
                  <div className="mb-3">
                    <i className="fas fa-phone text-muted me-2"></i>
                    <small>{agent.mobile}</small>
                  </div>
                  
                  <div className="text-muted">
                    <small>
                      <i className="fas fa-calendar text-muted me-2"></i>
                      Added: {new Date(agent.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Agent Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-plus me-2"></i>
                  Add New Agent
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="alert alert-success">
                      <i className="fas fa-check-circle me-2"></i>
                      {success}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      <i className="fas fa-user me-2"></i>
                      Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter agent name"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="mobile" className="form-label">
                      <i className="fas fa-phone me-2"></i>
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      placeholder="e.g., +1234567890"
                      pattern="^\+[1-9]\d{1,14}$"
                    />
                    <div className="form-text">
                      Include country code (e.g., +1234567890)
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Password *
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter password"
                      minLength="6"
                    />
                    <div className="form-text">
                      Password must be at least 6 characters long
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-2"></i>
                        Add Agent
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
