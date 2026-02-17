import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export const Auth0ProviderWithHistory = ({ children }) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!domain || !clientId) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Configuration Error</h2>
        <p>Auth0 environment variables not configured properly.</p>
        <p>Domain: {domain || 'MISSING'}</p>
        <p>ClientId: {clientId || 'MISSING'}</p>
        <p>Audience: {audience || 'NOT SET'}</p>
      </div>
    );
  }

  const authorizationParams = {
    redirect_uri: window.location.origin,
    scope: "openid profile email"
  };

  // Only add audience if it's set
  if (audience) {
    authorizationParams.audience = audience;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={authorizationParams}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};