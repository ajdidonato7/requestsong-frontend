import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';

// Import components
import UserView from './components/UserView/UserView';
import ArtistLogin from './components/ArtistView/ArtistLogin';
import ArtistRegister from './components/ArtistView/ArtistRegister';
import ArtistDashboard from './components/ArtistView/ArtistDashboard';
import Navigation from './components/Common/Navigation';

// Auth context
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <main className="main-content">
            <Routes>
              {/* User routes */}
              <Route path="/" element={<UserView />} />
              <Route path="/user" element={<Navigate to="/" replace />} />
              
              {/* Artist routes */}
              <Route path="/artist/login" element={<ArtistLogin />} />
              <Route path="/artist/register" element={<ArtistRegister />} />
              <Route path="/artist/dashboard" element={<ArtistDashboard />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Navigation />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;