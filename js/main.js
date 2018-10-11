let weatherApi = new WeatherApi();

$('#form').on('submit', function () {
    console.log('clicked submit');
    let city = $("#location").val();
    //Only call the API if location was given
    if (city) {
        getCurrentWeatherData(city);
        getWeatherForecastData(city);
    }
    return false;
});

async function getCurrentWeatherData(city) {
    try {
        let weatherData = await weatherApi.currentWeatherByCity(city);
        console.log(weatherData);
        displayCurrentWeather(weatherData);    
    }
    catch(error) {
        handleError(error);
    }
}

async function getWeatherForecastData(city) {
    try {
        let forecastData = await weatherApi.fiveDayForecastByCity(city);
        console.log(forecastData);
        displayFiveDayForecast(forecastData);    
    }
    catch(error) {
        handleError(error);
    }
}

function displayCurrentWeather(response) {
    $('.current-weather').removeClass("hidden");
    
    $('.location').html(response.name);
    $('.weather').html(response.weather[0].main);

    let weatherCategory = getWeatherCategory(response);
    updateBackgroundImage(weatherCategory);

    $('#temp-value').html(Math.round(response.main.temp) + "&#176;");
    $('#humidity-value').html(response.main.humidity);
    $('#pressure-value').html(response.main.pressure);
    $('#wind-speed-value').html(Math.round(response.wind.speed));
}

function displayFiveDayForecast(response) {
    $('.forecast').removeClass("hidden");
    response.list.forEach(function(weatherData) {
        console.log(console.log(weatherData));
    });
}

function handleError(error) {
    console.log("error code " + error.message);
    $('.location').html("Location not found, please try again.");
    $('.weather').addClass("hidden");
    $('.current-weather').addClass("hidden");
    $('.forecast').addClass("hidden");
}

function getWeatherCategory(response) {
    let statusCode = response.weather[0].id + ""; //cast to string
    console.log(statusCode);
    updateBackgroundImage(statusCode);

    //First character indicates the Category of weather. Source: https://openweathermap.org/weather-conditions
    let weatherCategory = "";
    switch (statusCode[0]) {
        case "2":
            weatherCategory = "stormy"; //in their words: thunderstorm
            break;
        case "3":
            weatherCategory = "cloudy"; //in their words: drizzle - TODO: find drizzle image
            break;
        case "5":
            weatherCategory = "rainy";
            break;
        case "6":
            weatherCategory = "snowy";
            break;
        case "7":
            weatherCategory = "foggy"; //in their words: atmosphere
            break;
        case "8":
            weatherCategory = "clear"; //TODO: sunny category?
            break;
        default:
            weatherCategory = "unkown";
            break;
    }

    //Edge case: 80x group: Clouds
    if (statusCode === "801" 
     || statusCode === "802"
     || statusCode === "803"
     || statusCode === "804") {
        weatherCategory = "cloudy";
    }

    console.log(weatherCategory);

    return weatherCategory;
}

function updateBackgroundImage(weatherCategory) {
    $('#weather-background').removeClass();
    $('#weather-background').addClass(weatherCategory);
}

function getCustomMessage(weatherCategory) {
    let message = "";
    switch (weatherCategory) {
        case "sunny":
            message = "Wherever you go, no matter what the weather, always bring your own sunshine.";
            break;
        case "rainy":
            message = "When life gives you a rainy day, play in the puddles.";
            break;
        case "cloudy":
            message = "But a cloudy day is no match for a sunny disposition.";
            break;
        case "stormy":
            message = "If you want to see the sunshine, you have to weather the storm.";
            break;
        default:
            message = "Unknown weather status";
            break;
    }
    return message;
}
