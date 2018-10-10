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
    return false;
});

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
