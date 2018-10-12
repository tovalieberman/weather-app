let weatherApi = new WeatherApi();

$('#form').on('submit', function () {
    console.log('clicked submit');
    let input = $("#location").val();
    //Only call the API if location was given
    if (input) {
        fetchAndDisplayCurrentWeatherData(input);
        fetchAndDisplayWeatherForecastData(input);
    }
    return false;
});

$("#use-location").on('click tap', function() {
    //Takes a while to fetch geolocation, show loading message in meantime
    if (navigator.geolocation) {
        $('.location').html("Loading...");
        //if successful call getWeatherData, if error call permissionDenied
        navigator.geolocation.getCurrentPosition(getWeatherDataByCoordinates, permissionDenied);
    } else {
        $('.location').html("Geolocation is not supported by this browser.");
    }
});

function getWeatherDataByCoordinates(position) {
    console.log("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude); 

    fetchAndDisplayCurrentWeatherData(position.coords.latitude, position.coords.longitude);
    fetchAndDisplayWeatherForecastData(position.coords.latitude, position.coords.longitude);
}

function permissionDenied(error) {
    if (error.code === 1) {
        $('.location').html("Permission denied by browser, please try again or type a location in the box.");
    }
    else {
        $('.location').html("Something went wrong, please try again or type a location in the box.");
    }
}

async function fetchAndDisplayCurrentWeatherData(input1, input2) {
    try {
        let weatherData = await weatherApi.currentWeather(input1, input2);
        console.log(weatherData);
        displayCurrentWeather(weatherData);    
    }
    catch(error) {
        handleError(error, "fetchAndDisplayCurrentWeatherData");
    }
}

async function fetchAndDisplayWeatherForecastData(input1, input2) {
    try {
        let forecastData = await weatherApi.fiveDayForecast(input1, input2);
        console.log(forecastData);
        displayFiveDayForecast(forecastData);
    }
    catch(error) {
        handleError(error, "fetchAndDisplayWeatherForecastData");
    }
}

function displayCurrentWeather(response) {
    $('.current-weather').removeClass("hidden");
    
    $('.location').html(response.name);
    $('.weather').html(formatDescription(response.weather[0].description));

    let weatherCategory = getWeatherCategory(response);
    updateBackgroundImage(weatherCategory);

    $('#temp-value').html(Math.round(response.main.temp) + "&#176;");
    $('#humidity-value').html(response.main.humidity);
    $('#pressure-value').html(response.main.pressure);
    $('#wind-speed-value').html(Math.round(response.wind.speed));
}

function displayFiveDayForecast(response) {
    $('.forecast').removeClass("hidden");
    let list = response.list;
    let flexbox;
    let flexboxesWrapper = $('<div>');
    for(let i = 0; i < list.length; i++) {
        flexbox = $('<div>').addClass("flex-container-" + (i + 1));
        flexbox.append($('<div>').addClass("cell heading-cell").html("Time"));
        flexbox.append($('<div>').addClass("cell value-cell time").html(getDateString(list[i].dt)));
        flexbox.append($('<div>').addClass("cell heading-cell").html("Icon"));
        flexbox.append($('<div>').addClass("cell value-cell icon").html(getImage(list[i].weather[0].icon)));
        flexbox.append($('<div>').addClass("cell heading-cell").html("Description"));
        flexbox.append($('<div>').addClass("cell value-cell").html(formatDescription(list[i].weather[0].description)));
        flexbox.append($('<div>').addClass("cell heading-cell").html("Temperature"));
        flexbox.append($('<div>').addClass("cell value-cell").html(Math.round(list[i].main.temp) + "&#176;"));
        flexbox.append($('<div>').addClass("cell heading-cell").html("Humidity"));
        flexbox.append($('<div>').addClass("cell value-cell").html(list[i].main.humidity + "%"));
        flexbox.append($('<div>').addClass("cell heading-cell").html("Air Pressure"));
        flexbox.append($('<div>').addClass("cell value-cell").html(Math.round(list[i].main.pressure) + " psa"));
        flexbox.append($('<div>').addClass("cell heading-cell").html("Wind"));
        flexbox.append($('<div>').addClass("cell value-cell").html(Math.round(list[i].wind.speed) + " mph"));
        flexboxesWrapper.append(flexbox);
    }
    $('.forecast-flexbox').html(flexboxesWrapper); //Use html() instead of append() so we don't end up with multiple tables
}

function getDateString(utcTime) {
    utcTime += "000";
    utcTime = parseInt(utcTime);
    let date = new Date(utcTime);
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];    
    day = days[date.getDay()];
    let time = date.toLocaleTimeString();
    //Manipulate time string to remove the seconds
    let pos = time.lastIndexOf(":");
    let hoursAndMin = time.substr(0, pos);
    let secondsAndAmPm = time.substr(pos + 1);
    let amPM = secondsAndAmPm.substr(secondsAndAmPm.indexOf(" "));
    let joinedTime = hoursAndMin.concat(amPM);
    //Construct date string
    let dateString = `${joinedTime}<br>${day}`;
    return dateString;
}

function getImage(code) {
    return $('<img>').attr('src', `https://openweathermap.org/img/w/${code}.png`);
}

function handleError(error, functionName) {
    console.log("error in " + functionName + ": " + error.message);
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

function formatDescription(string) {
    //capitalize first letter
    return string.charAt(0).toUpperCase() + string.slice(1);
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
