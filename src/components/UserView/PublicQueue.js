import React from 'react';

const PublicQueue = ({ requests, artistName, onRefresh }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTip = (amount) => {
    if (!amount) return null;
    return `$${amount.toFixed(2)}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'completed':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'completed':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const completedRequests = requests.filter(req => req.status === 'completed');

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="mb-0">Request Queue</h3>
            <p className="text-sm text-gray-600 mt-1 mb-0">
              {artistName}'s current queue
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="btn btn-sm btn-secondary"
            title="Refresh queue"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="card-body">
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No requests yet</p>
            <p className="text-sm text-gray-400">
              Be the first to request a song!
            </p>
          </div>
        ) : (
          <>
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4 text-gray-800">
                  Up Next ({pendingRequests.length})
                </h4>
                <div className="space-y-3">
                  {pendingRequests.map((request, index) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-color text-white text-sm font-medium rounded-full mr-3">
                            {request.queue_position}
                          </span>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">
                              {request.song_title}
                            </h5>
                            <p className="text-sm text-gray-600">
                              by {request.song_artist}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                          </span>
                          {request.tip_amount && (
                            <div className="text-sm font-medium text-green-600 mt-1">
                              {formatTip(request.tip_amount)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Requested by {request.requester_name}</span>
                        <span>{formatTime(request.created_at)}</span>
                      </div>
                      
                      {request.message && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700 mb-0">
                            "{request.message}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recently Completed */}
            {completedRequests.length > 0 && (
              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-800">
                  Recently Played ({completedRequests.slice(-5).length})
                </h4>
                <div className="space-y-2">
                  {completedRequests.slice(-5).reverse().map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h6 className="font-medium text-gray-700 mb-1">
                            {request.song_title}
                          </h6>
                          <p className="text-sm text-gray-500">
                            by {request.song_artist} • {request.requester_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                          </span>
                          {request.tip_amount && (
                            <div className="text-xs text-green-600 mt-1">
                              {formatTip(request.tip_amount)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublicQueue;