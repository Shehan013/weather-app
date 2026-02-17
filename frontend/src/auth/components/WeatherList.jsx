import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { weatherAPI, setAuthToken } from '../services/api';
import CityCard from './CityCard';


const WeatherList = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    fetchWeatherData();
  }, [isAuthenticated]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        setAuthToken(token);
      }

      const response = await weatherAPI.getCities();
      setCities(response.data.data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err.response?.data?.error || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-bold mb-2">Error</h3>
          <p>{error}</p>
          <button
            onClick={fetchWeatherData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Weather Comfort Rankings
        </h2>
        <p className="text-gray-600">
          Cities ranked by comfort score based on temperature, humidity, and wind
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <CityCard key={city.cityCode} city={city} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={fetchWeatherData}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
        >
          Refresh Weather Data
        </button>
      </div>
    </div>
  );
};

export default WeatherList;