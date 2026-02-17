const comfortService = require('../services/comfort.service');
const cacheService = require('../services/cache.service');

exports.getCities = async (req, res, next) => {
  try {
    const cities = await comfortService.getWeatherWithComfortIndex();
    
    res.json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (error) {
    console.error('Error in getCities:', error);
    next(error);
  }
};

exports.getCacheStatus = (req, res) => {
  try {
    const stats = cacheService.getStats();
    const cachedData = cacheService.get('weather:all:cities');
    
    res.json({
      success: true,
      cacheStatus: cachedData.hit ? 'HIT' : 'MISS',
      statistics: stats,
      cachedData: cachedData.hit ? {
        citiesCount: cachedData.data.length,
        topCity: cachedData.data[0]?.cityName,
        cachedAt: cachedData.data[0]?.fetchedAt
      } : null
    });
  } catch (error) {
    console.error('Error in getCacheStatus:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};