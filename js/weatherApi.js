
class WeatherApi {

    constructor(success, failure) {
        this.units = "imperial"; //switch to metric for celsius
        this.apiKey = "5a37ff291870ef42192074fc8420c55a";
    }
    
    async currentWeather(input1, input2) {
        console.log(input1, input2);
        let queryParam = this.getQueryParam(input1, input2);
        return this.callApi("weather", queryParam);
    }

    async fiveDayForecast(input1, input2) {
        let queryParam = this.getQueryParam(input1, input2);
        return this.callApi("forecast", queryParam);
    }
     
    getQueryParam(param1, param2) {
        let queryParam = '';
        //if 2 numeric values are passed, it's coordinates
        if (typeof param1 === "number" && typeof param2 === "number") {
            let latitude = param1;
            let longitude = param2;
            queryParam = `lat=${latitude}&lon=${longitude}`;
        }
        //if the input can be parsed into an int, could either be a zip code or a city ID, depending on num digits
        else if (parseInt(param1)) {
            if (param1.length > 5) {
                let id = param1;
                queryParam = `id=${id}`;
            }
            else {
                let zip = param1;
                queryParam = `zip=${zip}`;    
            }
        }
        else {
            let city = param1;
            queryParam = `q=${city}`;
        }
        return queryParam;
    }

    async callApi(action, query) {
        let url = `https://api.openweathermap.org/data/2.5/${action}?${query}&appid=${this.apiKey}&units=${this.units}`;
        
        let response = await fetch(url);
        let weatherData = await response.json();
        console.log(weatherData);
        return weatherData;
    }
}
