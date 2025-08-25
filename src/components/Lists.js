import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Lists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedList, setExpandedList] = useState(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await axios.get('/api/lists');
      setLists(response.data.data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setError('');
    setSuccess('');

    if (file) {
      const allowedTypes = ['.csv', '.xlsx', '.xls'];
      const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileExt)) {
        setError('Only CSV, XLSX, and XLS files are allowed');
        setSelectedFile(null);
        e.target.value = '';
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/lists/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess(`File uploaded successfully! ${response.data.data.totalItems} items distributed among ${response.data.data.distributions.length} agents.`);
        setSelectedFile(null);
        document.getElementById('fileInput').value = '';
        fetchLists();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const toggleExpanded = (listId) => {
    setExpandedList(expandedList === listId ? null : listId);
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
            <i className="fas fa-file-csv me-2"></i>
            List Management
          </h1>
          <p className="text-muted">Upload CSV files and view distributions</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="fas fa-upload me-2"></i>
            Upload CSV File
          </h5>
        </div>
        <div className="card-body">
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

          <div className="file-upload-area mb-3">
            <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
            <h5>Upload CSV, XLSX, or XLS File</h5>
            <p className="text-muted mb-3">
              File should contain columns: FirstName, Phone, Notes
            </p>
            
            <input
              type="file"
              id="fileInput"
              className="form-control mb-3"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
            />
            
            {selectedFile && (
              <div className="alert alert-info">
                <i className="fas fa-file me-2"></i>
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
            
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Uploading & Distributing...
                </>
              ) : (
                <>
                  <i className="fas fa-upload me-2"></i>
                  Upload & Distribute
                </>
              )}
            </button>
          </div>
          
          <div className="row text-center">
            <div className="col-md-4">
              <i className="fas fa-file-csv text-success fa-2x mb-2"></i>
              <p className="small text-muted">CSV Files</p>
            </div>
            <div className="col-md-4">
              <i className="fas fa-file-excel text-success fa-2x mb-2"></i>
              <p className="small text-muted">Excel Files</p>
            </div>
            <div className="col-md-4">
              <i className="fas fa-users text-primary fa-2x mb-2"></i>
              <p className="small text-muted">Auto Distribution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lists Section */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="fas fa-list me-2"></i>
            Uploaded Lists ({lists.length})
          </h5>
        </div>
        <div className="card-body">
          {lists.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <h5>No Lists Uploaded</h5>
              <p className="text-muted">Upload your first CSV file to get started</p>
            </div>
          ) : (
            <div className="accordion" id="listsAccordion">
              {lists.map((list, index) => (
                <div key={list._id} className="accordion-item mb-3">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${expandedList === list._id ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => toggleExpanded(list._id)}
                    >
                      <div className="d-flex align-items-center w-100">
                        <div className="me-3">
                          <i className="fas fa-file-csv text-success"></i>
                        </div>
                        <div className="flex-grow-1">
                          <strong>{list.fileName}</strong>
                          <div className="small text-muted">
                            {list.totalItems} items • {list.distributions.length} agents • 
                            {new Date(list.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="me-3">
                          <span className="badge bg-primary">{list.totalItems} items</span>
                        </div>
                      </div>
                    </button>
                  </h2>
                  
                  {expandedList === list._id && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body">
                        <div className="row">
                          {list.distributions.map((distribution, distIndex) => (
                            <div key={distIndex} className="col-md-6 mb-3">
                              <div className="distribution-item">
                                <div className="d-flex align-items-center mb-2">
                                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                                    <i className="fas fa-user"></i>
                                  </div>
                                  <div>
                                    <h6 className="mb-0">{distribution.agent.name}</h6>
                                    <small className="text-muted">{distribution.agent.email}</small>
                                  </div>
                                  <div className="ms-auto">
                                    <span className="badge bg-info">{distribution.assignedCount} items</span>
                                  </div>
                                </div>
                                
                                <div className="mt-2">
                                  <small className="text-muted">Sample items:</small>
                                  <ul className="list-unstyled mt-1">
                                    {distribution.items.slice(0, 3).map((item, itemIndex) => (
                                      <li key={itemIndex} className="small">
                                        <i className="fas fa-user me-1"></i>
                                        {item.firstName} - {item.phone}
                                        {item.notes && (
                                          <div className="text-muted ms-3">
                                            <i className="fas fa-sticky-note me-1"></i>
                                            {item.notes.substring(0, 50)}
                                            {item.notes.length > 50 && '...'}
                                          </div>
                                        )}
                                      </li>
                                    ))}
                                    {distribution.items.length > 3 && (
                                      <li className="small text-muted">
                                        ... and {distribution.items.length - 3} more items
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lists;
