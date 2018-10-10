$('#form').on('submit', function() {
    console.log('clicked submit');
    let location = $('#location').val();
    let weatherList = ["Sunny", "Cloudy", "Rainy", "Stormy", "Clear", "Snowy", "Foggy"];
    let weatherRand = Math.floor(Math.random() * weatherList.length);
    let weather = weatherList[weatherRand];
    let message = getCustomMessage(weather);
    $('.response').html(`<h3 class="location">${location}</h3><h2 class="weather">${weather}</h2>`);
    $('#weather-background').removeClass();
    $('#weather-background').addClass(weather.toLowerCase());
    $('.current-weather').removeClass("hidden");
    $('.forecast').removeClass("hidden");
    callAPI();
    return false;
});

let units = "imperial"; //switch to metric for celsius
let apiKey = "5a37ff291870ef42192074fc8420c55a";
let query = "London,UK";
let action = "weather"; //switch to forecast for 5-day forecast

function callAPI() {
    $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/${action}?q=${query}&appid=${apiKey}&units=${units}`,
        success: displayOutput,
        error: function(data, status, errorThrown) {
          console.log('error code ' + status);
        }
    });
}

function displayOutput(resp) {
    console.log(resp);
    let nameH2 = $('<h2>').html(resp.name);
    $('.response').append(nameH2);
    let weatherH2 = $('<h2>').html(resp.weather[0].main);
    $('.response').append(weatherH2);

    $('#temp-value').html(Math.round(resp.main.temp));
    $('#humidity-value').html(resp.main.humidity);
    $('#pressure-value').html(resp.main.pressure);
    $('#wind-speed-value').html(Math.round(resp.wind.speed));
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
