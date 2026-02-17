import React from 'react';
import { 
  WiDaySunny, 
  WiCloudy, 
  WiRain, 
  WiThunderstorm, 
  WiSnow, 
  WiFog,
  WiDayCloudy,
  WiStormShowers,
  WiDust,
  WiTornado
} from 'react-icons/wi';
import { WiHumidity } from 'react-icons/wi';
import { FaWind, FaStar } from 'react-icons/fa';

const CityCard = ({ city, isFavorite }) => {

    const getScoreColor = (score) => {
    if (score >= 75) return 'bg-green-100 border-green-500 text-green-800';
    if (score >= 50) return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    return 'bg-red-100 border-red-500 text-red-800';
  };

  const getWeatherIcon = (condition) => {
    const iconProps = { size: 64, className: "text-blue-500" };
    
    const icons = {
      Clear: <WiDaySunny {...iconProps} className="text-yellow-500" />,
      Clouds: <WiCloudy {...iconProps} className="text-gray-500" />,
      Rain: <WiRain {...iconProps} className="text-blue-600" />,
      Drizzle: <WiDayCloudy {...iconProps} className="text-blue-400" />,
      Thunderstorm: <WiThunderstorm {...iconProps} className="text-purple-600" />,
      Snow: <WiSnow {...iconProps} className="text-blue-200" />,
      Mist: <WiFog {...iconProps} className="text-gray-400" />,
      Smoke: <WiFog {...iconProps} className="text-gray-500" />,
      Haze: <WiFog {...iconProps} className="text-gray-400" />,
      Dust: <WiDust {...iconProps} className="text-orange-400" />,
      Fog: <WiFog {...iconProps} className="text-gray-400" />,
      Sand: <WiDust {...iconProps} className="text-orange-300" />,
      Ash: <WiDust {...iconProps} className="text-gray-600" />,
      Squall: <WiStormShowers {...iconProps} className="text-blue-700" />,
      Tornado: <WiTornado {...iconProps} className="text-gray-700" />,
    };
    
    return icons[condition] || <WiDayCloudy {...iconProps} />;
  };

  const scoreColorClass = getScoreColor(city.comfortScore);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 relative">
      {isFavorite && (
        <div className="absolute top-3 right-3">
          <FaStar className="text-yellow-500" size={24} />
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">
          {city.rank}
        </span>
        <div>{getWeatherIcon(city.weather.main)}</div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-2">{city.cityName}</h3>

      <p className="text-gray-600 capitalize mb-4">{city.weather.description}</p>

      <div className="mb-4">
        <p className="text-4xl font-bold text-gray-900">
          {Math.round(city.weather.temperature)}°C
        </p>
        <p className="text-sm text-gray-500">
          Feels like {Math.round(city.weather.feelsLike)}°C
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="flex items-center">
          <WiHumidity size={20} className="text-blue-500" />
          <span className="ml-1 text-gray-600">Humidity:</span>
          <span className="ml-2 font-semibold">{city.weather.humidity}%</span>
        </div>
        <div className="flex items-center">
          <FaWind size={16} className="text-gray-500" />
          <span className="ml-1 text-gray-600">Wind:</span>
          <span className="ml-2 font-semibold">{city.weather.windSpeed} m/s</span>
        </div>
      </div>

      <div className={`${scoreColorClass} border-2 rounded-lg p-3 text-center`}>
        <p className="text-sm font-semibold mb-1">Comfort Score</p>
        <p className="text-3xl font-bold">{Math.round(city.comfortScore)}</p>
      </div>
    </div>
  );
};

export default CityCard;