
class WeatherApi {

    constructor(success, failure) {
        this.units = "imperial"; //switch to metric for celsius
        this.apiKey = "5a37ff291870ef42192074fc8420c55a";
    }
    
    currentWeatherByCity(city) {
        return this.callAPI("weather", city);
    }

    fiveDayForecastByCity(city) {
        return this.callAPI("forecast", city);
    }

    // callAPI(action, query, successCallback, failureCallback) {
    //     $.ajax({
    //         Category: "GET",
    //         url: `https://api.openweathermap.org/data/2.5/${action}?q=${query}&appid=${this.apiKey}&units=${this.units}`,
    //         success: successCallback,
    //         error: failureCallback,
    //     });
    // }
    async callAPI(action, query) {
        let url = `https://api.openweathermap.org/data/2.5/${action}?q=${query}&appid=${this.apiKey}&units=${this.units}`;
        
        let response = await fetch(url);
        let weatherData = await response.json();
        return weatherData;
    }
}
