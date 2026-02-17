import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center space-x-3">
      <img
        src={user.picture}
        alt={user.name}
        className="w-10 h-10 rounded-full border-2 border-gray-300"
      />
      <div>
        <p className="font-semibold text-gray-800">{user.name}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
    </div>
  );
};

export default UserProfile;