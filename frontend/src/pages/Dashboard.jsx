import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import WeatherList from '../components/WeatherList';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import UserProfile from '../components/UserProfile';

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-600"> Weather Analytics</h1>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated && <UserProfile />}
              {isAuthenticated && (
                <Link
                  to="/settings"
                  className="text-gray-600 hover:text-blue-600 font-semibold"
                >
                  Settings
                </Link>
              )}
              <LoginButton />
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main>
        {!isAuthenticated && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mx-4 mt-6">
            <p className="text-blue-800">
              <strong>Note:</strong> Please log in to access personalized features and save preferences.
            </p>
          </div>
        )}
        <WeatherList />
      </main>
    </div>
  );
};

export default Dashboard;