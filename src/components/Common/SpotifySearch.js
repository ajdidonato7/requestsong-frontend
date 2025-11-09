import React, { useState, useEffect, useCallback } from 'react';
import { spotifyAPI } from '../../services/api';

const SpotifySearch = ({ onTrackSelect, placeholder = "Search for a song..." }) => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  // Debounce search function
  const debounceSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setTracks([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await spotifyAPI.searchTracks(searchQuery, 10);
        setTracks(response.data);
        setShowResults(true);
      } catch (err) {
        setError('Failed to search tracks. Please try again.');
        setTracks([]);
        setShowResults(false);
      } finally {
        setLoading(false);
      }
    }, 500),
    [setTracks, setShowResults, setLoading, setError]
  );

  useEffect(() => {
    debounceSearch(query);
  }, [query, debounceSearch]);

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    setQuery(`${track.name} - ${track.artist}`);
    setShowResults(false);
    setTracks([]); // Clear tracks to ensure dropdown doesn't reappear
    
    // Call the parent callback with track data
    onTrackSelect({
      song_title: track.name,
      song_artist: track.artist,
      spotify_track_id: track.id,
      spotify_track_url: track.external_url,
      album_image_url: track.album_image,
      preview_url: track.preview_url
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // If user clears the input, reset selection
    if (!value.trim()) {
      setSelectedTrack(null);
      setTracks([]);
      setShowResults(false);
      onTrackSelect(null);
    } else if (selectedTrack && value !== `${selectedTrack.name} - ${selectedTrack.artist}`) {
      // If user modifies the selected track text, clear the selection
      setSelectedTrack(null);
      setShowResults(false);
      onTrackSelect(null);
    }
  };

  const handleInputFocus = () => {
    // Only show results if there's no selected track and we have search results
    if (tracks.length > 0 && !selectedTrack) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow for track selection
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  const formatDuration = (durationMs) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="spotify-search-container" style={{ position: 'relative' }}>
      <div className="form-group">
        <label className="form-label">
          Search for a Song *
        </label>
        <input
          type="text"
          className="form-input"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          autoComplete="off"
        />
        
        {loading && (
          <div className="mt-2 text-sm text-gray-600">
            <span className="loading mr-2"></span>
            Searching...
          </div>
        )}
        
        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {showResults && tracks.length > 0 && (
        <div 
          className="spotify-results"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000
          }}
        >
          {tracks.map((track) => (
            <div
              key={track.id}
              className="track-result"
              style={{
                padding: '12px',
                borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur
                handleTrackSelect(track);
              }}
              onMouseEnter={(e) => e.target.closest('.track-result').style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.target.closest('.track-result').style.backgroundColor = 'white'}
            >
              {track.album_image && (
                <img
                  src={track.album_image}
                  alt={`${track.album} cover`}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '4px',
                    objectFit: 'cover'
                  }}
                />
              )}
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div 
                  style={{ 
                    fontWeight: '500',
                    color: '#111827',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {track.name}
                </div>
                <div 
                  style={{ 
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {track.all_artists}
                </div>
                <div 
                  style={{ 
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {track.album} • {formatDuration(track.duration_ms)}
                </div>
              </div>

              {track.preview_url && (
                <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
                  Preview
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedTrack && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-3">
            {selectedTrack.album_image && (
              <img
                src={selectedTrack.album_image}
                alt={`${selectedTrack.album} cover`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '4px',
                  objectFit: 'cover'
                }}
              />
            )}
            <div>
              <div className="text-sm font-medium text-green-800">
                Selected: {selectedTrack.name}
              </div>
              <div className="text-xs text-green-600">
                by {selectedTrack.all_artists}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default SpotifySearch;