import React, { useState } from 'react';
import ArtistSearch from './ArtistSearch';
import RequestForm from './RequestForm';
import PublicQueue from './PublicQueue';
import { artistsAPI, requestsAPI } from '../../services/api';

const UserView = () => {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleArtistSelect = async (artistUsername) => {
    setLoading(true);
    setError('');
    
    try {
      // Get artist profile
      const artistResponse = await artistsAPI.getProfile(artistUsername);
      setSelectedArtist(artistResponse.data);
      
      // Get artist's requests
      const requestsResponse = await requestsAPI.getByArtist(artistUsername);
      setRequests(requestsResponse.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Artist not found');
      setSelectedArtist(null);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (requestData) => {
    try {
      const response = await requestsAPI.create({
        ...requestData,
        artist_username: selectedArtist.username
      });
      
      // Add new request to the list
      setRequests(prev => [...prev, response.data]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Failed to submit request'
      };
    }
  };

  const refreshQueue = async () => {
    if (selectedArtist) {
      try {
        const response = await requestsAPI.getByArtist(selectedArtist.username);
        setRequests(response.data);
      } catch (err) {
        console.error('Failed to refresh queue:', err);
      }
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="safe-area-top">
        <header className="text-center mb-8 mt-6">
          <h1>🎵 Requestr</h1>
          <p className="text-gray-600">Request songs from live musicians</p>
        </header>

        {/* Artist Search */}
        <div className="mb-8">
          <ArtistSearch 
            onArtistSelect={handleArtistSelect}
            loading={loading}
            error={error}
          />
        </div>

        {/* Selected Artist Info */}
        {selectedArtist && (
          <div className="card mb-6">
            <div className="card-body">
              <h2 className="mb-2">{selectedArtist.display_name}</h2>
              <p className="text-gray-600 mb-0">@{selectedArtist.username}</p>
              {selectedArtist.bio && (
                <p className="text-gray-700 mt-4 mb-0">{selectedArtist.bio}</p>
              )}
            </div>
          </div>
        )}

        {/* Request Form */}
        {selectedArtist && (
          <div className="mb-8">
            <RequestForm 
              onSubmit={handleRequestSubmit}
              artistName={selectedArtist.display_name}
            />
          </div>
        )}

        {/* Public Queue */}
        {selectedArtist && (
          <PublicQueue 
            requests={requests}
            artistName={selectedArtist.display_name}
            onRefresh={refreshQueue}
          />
        )}
      </div>
    </div>
  );
};

export default UserView;