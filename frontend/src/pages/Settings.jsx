import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { userAPI, weatherAPI, setAuthToken } from '../services/api';

const Settings = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [cacheStatus, setCacheStatus] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      setAuthToken(token);

      const citiesResponse = await weatherAPI.getCities();
      setAllCities(citiesResponse.data.data);

      try {
        const prefResponse = await userAPI.getPreference('favorite_cities');
        if (prefResponse.data.data) {
          setFavoriteCities(prefResponse.data.data);
        }
      } catch (err) {
        setFavoriteCities([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showMessage('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const loadCacheStatus = async () => {
    try {
      const response = await weatherAPI.getCacheStatus();
      setCacheStatus(response.data);
    } catch (error) {
      console.error('Error loading cache status:', error);
    }
  };

  const handleToggleFavorite = (cityCode) => {
    setFavoriteCities((prev) => {
      if (prev.includes(cityCode)) {
        return prev.filter((code) => code !== cityCode);
      } else {
        return [...prev, cityCode];
      }
    });
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      const token = await getAccessTokenSilently();
      setAuthToken(token);

      await userAPI.savePreference('favorite_cities', favoriteCities);
      showMessage('success', 'Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      showMessage('error', 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (loading) {
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
            <h1 className="text-3xl font-bold text-blue-600"> Settings</h1>
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 font-semibold"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
          <div className="flex items-center space-x-4">
            <img
              src={user.picture}
              alt={user.name}
              className="w-16 h-16 rounded-full border-2 border-gray-300"
            />
            <div>
              <p className="font-semibold text-lg text-gray-800">{user.name}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Favorite Cities
          </h2>
          <p className="text-gray-600 mb-4">
            Select your favorite cities to personalize your experience.
          </p>

          <div className="space-y-2">
            {allCities.map((city) => (
              <label
                key={city.cityCode}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={favoriteCities.includes(city.cityCode)}
                  onChange={() => handleToggleFavorite(city.cityCode)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-800 font-medium">
                  {city.cityName}
                </span>
                <span className="ml-auto text-sm text-gray-500">
                  Score: {Math.round(city.comfortScore)}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Cache Debug Information
          </h2>
          <p className="text-gray-600 mb-4">
            View the current cache status and performance metrics.
          </p>

          <button
            onClick={loadCacheStatus}
            className="mb-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Load Cache Status
          </button>

          {cacheStatus && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Cache Status:</span>
                <span
                  className={`font-bold ${
                    cacheStatus.cacheStatus === 'HIT'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {cacheStatus.cacheStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Hits:</span>
                <span>{cacheStatus.statistics.hits}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Misses:</span>
                <span>{cacheStatus.statistics.misses}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Hit Rate:</span>
                <span className="font-bold text-blue-600">
                  {cacheStatus.statistics.hitsRate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Cached Keys:</span>
                <span>{cacheStatus.statistics.keysCount}</span>
              </div>
              {cacheStatus.cachedData && (
                <>
                  <div className="flex justify-between">
                    <span className="font-semibold">Cities Cached:</span>
                    <span>{cacheStatus.cachedData.citiesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Top City:</span>
                    <span>{cacheStatus.cachedData.topCity}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;