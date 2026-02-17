import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;