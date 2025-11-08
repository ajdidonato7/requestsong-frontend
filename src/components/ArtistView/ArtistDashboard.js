import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { requestsAPI } from '../../services/api';

const ArtistDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const { artist, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const loadRequests = useCallback(async () => {
    if (!artist) return;
    
    try {
      setLoading(true);
      const response = await requestsAPI.getByArtist(artist.username, 'all');
      setRequests(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load requests');
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  }, [artist]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/artist/login');
      return;
    }
    loadRequests();
  }, [isAuthenticated, navigate, loadRequests]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    
    try {
      await requestsAPI.update(requestId, { status: newStatus });
      await loadRequests(); // Reload to get updated queue
    } catch (err) {
      console.error('Error updating request:', err);
      alert('Failed to update request status');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    
    try {
      await requestsAPI.delete(requestId);
      await loadRequests(); // Reload to get updated queue
    } catch (err) {
      console.error('Error deleting request:', err);
      alert('Failed to delete request');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatTip = (amount) => {
    if (!amount) return null;
    return `$${amount.toFixed(2)}`;
  };

  // Removed unused getStatusColor function

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const completedRequests = requests.filter(req => req.status === 'completed');
  const totalTips = requests
    .filter(req => req.tip_amount)
    .reduce((sum, req) => sum + req.tip_amount, 0);

  if (!artist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="safe-area-top">
        {/* Header */}
        <div className="flex justify-between items-center mt-6 mb-6">
          <div>
            <h1 className="mb-2">🎤 Dashboard</h1>
            <p className="text-gray-600 mb-0">Welcome back, {artist.display_name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-secondary"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-primary-color mb-2">
                {pendingRequests.length}
              </div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {completedRequests.length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-secondary-color mb-2">
                ${totalTips.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Tips</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 mb-0">❌ {error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="loading mx-auto mb-4"></div>
            <p className="text-gray-500">Loading requests...</p>
          </div>
        ) : (
          <>
            {/* Pending Requests */}
            <div className="card mb-8">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h3 className="mb-0">Pending Requests ({pendingRequests.length})</h3>
                  <button
                    onClick={loadRequests}
                    className="btn btn-sm btn-secondary"
                    disabled={loading}
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>
              
              <div className="card-body">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No pending requests</p>
                    <p className="text-sm text-gray-400">
                      Share your username: <strong>@{artist.username}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-color text-white text-sm font-medium rounded-full mr-3">
                              {request.queue_position}
                            </span>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                {request.song_title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                by {request.song_artist}
                              </p>
                            </div>
                          </div>
                          {request.tip_amount && (
                            <div className="text-lg font-medium text-green-600">
                              {formatTip(request.tip_amount)}
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">
                            Requested by <strong>{request.requester_name}</strong>
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(request.created_at)}
                          </p>
                        </div>
                        
                        {request.message && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700 mb-0">
                              "{request.message}"
                            </p>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'completed')}
                            className="btn btn-sm btn-success"
                            disabled={actionLoading[request.id]}
                          >
                            {actionLoading[request.id] ? (
                              <span className="loading"></span>
                            ) : (
                              '✅ Mark Complete'
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleDelete(request.id)}
                            className="btn btn-sm btn-error"
                            disabled={actionLoading[request.id]}
                          >
                            {actionLoading[request.id] ? (
                              <span className="loading"></span>
                            ) : (
                              '🗑️ Delete'
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recently Completed */}
            {completedRequests.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h3 className="mb-0">Recently Completed ({completedRequests.length})</h3>
                </div>
                
                <div className="card-body">
                  <div className="space-y-3">
                    {completedRequests.slice(-10).reverse().map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-700 mb-1">
                              {request.song_title}
                            </h5>
                            <p className="text-sm text-gray-500">
                              by {request.song_artist} • {request.requester_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              ✅ Completed
                            </span>
                            {request.tip_amount && (
                              <div className="text-sm font-medium text-green-600 mt-1">
                                {formatTip(request.tip_amount)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArtistDashboard;