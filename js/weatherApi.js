
class WeatherApi {

    constructor(success, failure) {
        this.units = "imperial"; //switch to metric for celsius
        this.apiKey = "5a37ff291870ef42192074fc8420c55a";
    }
    
    async currentWeatherByCity(city) {
        return this.callApiByCity("weather", city);
    }

    async fiveDayForecastByCity(city) {
        return this.callApiByCity("forecast", city);
    }
    
    async currentWeatherByCoordinates(lat, long) {
        return this.callApiByCoord("weather", lat, long);
    }

    async fiveDayForecastByCoordinates(lat, long) {
        return this.callApiByCoord("forecast", lat, long);
    }
    
    async callApiByCity(action, query) {
        let url = `https://api.openweathermap.org/data/2.5/${action}?q=${query}&appid=${this.apiKey}&units=${this.units}`;
        
        let response = await fetch(url);
        let weatherData = await response.json();
        return weatherData;
    }

    async callApiByCoord(action, lat, long) {
        let url = `https://api.openweathermap.org/data/2.5/${action}?lat=${lat}&lon=${long}&appid=${this.apiKey}&units=${this.units}`;
        
        let response = await fetch(url);
        let weatherData = await response.json();
        return weatherData;
    }
}
