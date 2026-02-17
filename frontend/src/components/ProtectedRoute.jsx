import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access this page.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;