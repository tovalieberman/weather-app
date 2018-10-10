$('#form').on('submit', function () {
    console.log('clicked submit');
    callAPI();
    // let weather = getWeatherStatus();
    // updateBackgroundImage();
    return false;
});



let units = "imperial"; //switch to metric for celsius
let apiKey = "5a37ff291870ef42192074fc8420c55a";
let query = "New York";
let action = "weather"; //switch to forecast for 5-day forecast

function callAPI() {
    $.ajax({
        Category: "GET",
        url: `https://api.openweathermap.org/data/2.5/${action}?q=${query}&appid=${apiKey}&units=${units}`,
        success: handleResponse,
        error: function (data, status, errorThrown) {
            console.log('error code ' + status);
        }
    });
}

function handleResponse(response) {
    displayOutput(response);
    let weatherStatus = getWeatherStatus(response);
    updateBackgroundImage(weatherStatus);
}

function displayOutput(resp) {
    console.log(resp);
    $('.location').html(resp.name);
    $('.weather').html(resp.weather[0].main);

    $('#temp-value').html(Math.round(resp.main.temp) + "&#176;");
    $('#humidity-value').html(resp.main.humidity);
    $('#pressure-value').html(resp.main.pressure);
    $('#wind-speed-value').html(Math.round(resp.wind.speed));
}

function getWeatherStatus(response) {
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
    $('.current-weather').removeClass("hidden");
    $('.forecast').removeClass("hidden");
}

function getCustomMessage(weather) {
    let message = "";
    switch (weather) {
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
