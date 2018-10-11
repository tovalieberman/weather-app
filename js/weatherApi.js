
class WeatherApi {

    constructor(success, failure) {
        this.units = "imperial"; //switch to metric for celsius
        this.apiKey = "5a37ff291870ef42192074fc8420c55a";
        this.successCallback = success;
        this.failureCallback = failure;
    }
    
    currentWeatherByCity(city) {
        this.callAPI("weather", city);
    }

    fiveDayForecastByCity(city) {
        this.callAPI("forecast", city);
    }

    callAPI(action, query) {
        $.ajax({
            Category: "GET",
            url: `https://api.openweathermap.org/data/2.5/${action}?q=${query}&appid=${this.apiKey}&units=${this.units}`,
            success: this.successCallback,
            error: this.failureCallback,
        });
    }
}
