const axios = require('axios');
const fs = require('fs');
const path = require('path');

class WeatherService {
    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.baseurl = 'https://api.openweathermap.org/data/2.5/weather';
        this.cities = this.loadCities();
    }

    loadCities() {
        try{
            const citiesPath = path.join(__dirname, '/../../cities.json');
            const citiesData = fs.readFileSync(citiesPath, 'utf-8');
            const parsed = JSON.parse(citiesData);
            return parsed.List;
        } catch(error){
            console.error('Error loading cities:', error);
            return [];
        }
    }

    async getWeatherByCityCode(cityCode) {
        try{
            const url = `${this.baseurl}?id=${cityCode}&appid=${this.apiKey}&units=metric`;
            const response =  await axios.get(url);
            return {
                success: true,
                data: response.data
            };
        } catch(error){
            console.error(`Error fetching weather for city code ${cityCode}:`, error.message);
            return {
                success: false,
                cityCode: cityCode,
                error: error.message
            };
        }
    }

    async getWeatherForAllCities() {
        const weatherPromises = this.cities.map(city => this.getWeatherByCityCode(city.CityCode));
        const results = await Promise.all(weatherPromises);

        const weatherData = results.map((result, index) => {
            if(!result.success) {
                console.warn(`Failed to fetch weather for city code ${this.cities[index].CityName}`);
                return null;
            }

            const city = this.cities[index];
            return {
                cityCode: city.CityCode,
                cityName: result.data.name,
                weather: {
                    temperature: result.data.main.temp,
                    feelsLike: result.data.main.feels_like,
                    humidity: result.data.main.humidity,
                    pressure: result.data.main.pressure,
                    description: result.data.weather[0].description,
                    main: result.data.weather[0].main, 
                    icon: result.data.weather[0].icon,
                    windSpeed: result.data.wind.speed,
                    cloudiness: result.data.clouds.all,
                    visibility: result.data.visibility
                },
                fetchAT: new Date().toISOString()
            };
            })
            .filter(item => item !== null); 
        
        console.log(`Successfully fetched weather for ${weatherData.length} cities.`);
        return weatherData;
        }
}

module.exports = new WeatherService();