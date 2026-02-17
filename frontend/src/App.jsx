import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Auth0ProviderWithHistory } from './auth/Auth0ProviderWithHistory';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Auth0ProviderWithHistory>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Auth0ProviderWithHistory>
    </BrowserRouter>
  );
}

export default App;