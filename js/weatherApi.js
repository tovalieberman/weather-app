
class WeatherApi {

    constructor(success, failure) {
        this.units = "imperial"; //switch to metric for celsius
        this.apiKey = "5a37ff291870ef42192074fc8420c55a";
    }
    
    currentWeatherByCity(city, successCallback, failureCallback) {
        this.callAPI("weather", city, successCallback, failureCallback);
    }

    fiveDayForecastByCity(city, successCallback, failureCallback) {
        this.callAPI("forecast", city, successCallback, failureCallback);
    }

    callAPI(action, query, successCallback, failureCallback) {
        $.ajax({
            Category: "GET",
            url: `https://api.openweathermap.org/data/2.5/${action}?q=${query}&appid=${this.apiKey}&units=${this.units}`,
            success: successCallback,
            error: failureCallback,
        });
    }
}
