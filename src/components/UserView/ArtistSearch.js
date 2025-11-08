import React, { useState } from 'react';

const ArtistSearch = ({ onArtistSelect, loading, error }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onArtistSelect(username.trim());
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="mb-4">Find an Artist</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Artist Username
            </label>
            <input
              type="text"
              id="username"
              className={`form-input ${error ? 'form-error' : ''}`}
              placeholder="Enter artist username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            {error && (
              <div className="error-message">{error}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || !username.trim()}
          >
            {loading ? (
              <>
                <span className="loading mr-2"></span>
                Searching...
              </>
            ) : (
              'Search Artist'
            )}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-sm text-gray-600 text-center">
            Enter the username of the musician you want to request songs from
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtistSearch;