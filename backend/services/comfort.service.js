const cacheService = require('./cache.service');
const weatherService = require('./weather.service');

class ComfortService {
    constructor() {

        this.IdealTemp = 24;
        this.IdealHumidity = 50;
        this.IdealWind = 2;

        this.maxTempChange = 20;
        this.maxHumidityChange = 50;
        this.maxWindChange = 13;

        this.weightTemp = 6;
        this.weightHumidity = 3;
        this.weightWind = 1;
    }

    calculateComfortIndex(weather){
        const tempDeviation = Math.abs(weather.temperature - this.IdealTemp)/this.maxTempChange;
        const humidityDeviation = Math.abs(weather.humidity - this.IdealHumidity)/this.maxHumidityChange;
        const windDeviation = Math.abs(weather.windSpeed - this.IdealWind)/this.maxWindChange;

        const weightedDeviation = ((tempDeviation * this.weightTemp) +
                                  (humidityDeviation * this.weightHumidity) +
                                  (windDeviation * this.weightWind))/10; 
                                  
        const comfortScore = (1-weightedDeviation) * 100;

        return Math.max(0, Math.min(100, comfortScore));
    }

    async getWeatherWithComfortIndex() {
        const CACHE_KEY = 'weather:all:cities';

        const cached = cacheService.get(CACHE_KEY);
        if(cached.hit) {
            console.log('Cache hit for weather data');
            return cached.data;
        }

        console.log('Cache miss for weather data, fetching from API');

        const weatherData = await weatherService.getWeatherForAllCities();

        const citiesWithComfortIndex = weatherData.map(city => ({
            ...city,
            comfortScore: this.calculateComfortIndex(city.weather)
        }));

        citiesWithComfortIndex.sort((a,b) => b.comfortScore - a.comfortScore);

        const rankedCities = citiesWithComfortIndex.map((city, index) => ({
            ...city,
            rank: index + 1,
        }));

        cacheService.set(CACHE_KEY, rankedCities);

         console.log(`Cached ${rankedCities.length} cities with comfort scores`);
    
        return rankedCities;
    }
}

module.exports = new ComfortService();