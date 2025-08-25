import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalLists: 0,
    totalItems: 0
  });
  const [recentLists, setRecentLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [agentsRes, listsRes] = await Promise.all([
        axios.get('/api/agents'),
        axios.get('/api/lists')
      ]);

      const agents = agentsRes.data.data;
      const lists = listsRes.data.data;
      
      const totalItems = lists.reduce((sum, list) => sum + list.totalItems, 0);

      setStats({
        totalAgents: agents.length,
        totalLists: lists.length,
        totalItems: totalItems
      });

      setRecentLists(lists.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
            <i className="fas fa-chart-line me-2"></i>
            Shubham Silyan Dashboard
          </h1>
          <p className="text-muted">Agent Management System - Welcome to your admin dashboard</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card dashboard-stats">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">Total Agents</h5>
                  <h2 className="mb-0">{stats.totalAgents}</h2>
                </div>
                <div className="ms-3">
                  <i className="fas fa-users fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card dashboard-stats">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">Total Lists</h5>
                  <h2 className="mb-0">{stats.totalLists}</h2>
                </div>
                <div className="ms-3">
                  <i className="fas fa-file-csv fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card dashboard-stats">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">Total Items</h5>
                  <h2 className="mb-0">{stats.totalItems}</h2>
                </div>
                <div className="ms-3">
                  <i className="fas fa-list fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Lists */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Lists
              </h5>
            </div>
            <div className="card-body">
              {recentLists.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No lists uploaded yet</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Total Items</th>
                        <th>Agents Assigned</th>
                        <th>Upload Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLists.map((list) => (
                        <tr key={list._id}>
                          <td>
                            <i className="fas fa-file-csv text-success me-2"></i>
                            {list.fileName}
                          </td>
                          <td>
                            <span className="badge bg-primary">
                              {list.totalItems}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {list.distributions.length}
                            </span>
                          </td>
                          <td>
                            {new Date(list.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
