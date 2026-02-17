import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (isAuthenticated) return null;

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
    >
      Log In
    </button>
  );
};

export default LoginButton;