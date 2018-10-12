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

$("#convert-button").on('click tap', function() {
    //Switch to Celsius and update button text
    if (weatherApi.units === "imperial") {
        weatherApi.units = "metric";
        $("#convert-button").html("Switch to Farenheit");
    }
    //Switch to Farenheit and update button text
    else {
        weatherApi.units = "imperial";
        $("#convert-button").html("Switch to Celsius");
    }
    //Call API again, using the city ID rather than the input to capture the most 
    //accurate location, even if the user searched using current location
    let cityID = $('.exact-location').html();
    fetchAndDisplayCurrentWeatherData(cityID);
    fetchAndDisplayWeatherForecastData(cityID);
});

function getWeatherDataByCoordinates(position) {
    console.log("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude); 

    fetchAndDisplayCurrentWeatherData(position.coords.latitude, position.coords.longitude);
    fetchAndDisplayWeatherForecastData(position.coords.latitude, position.coords.longitude);
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
    
    //Update hidden field with city ID as returned from API so that we can call it again and get the same results
    $('.exact-location').html(response.id);

    let weatherCategory = getWeatherCategory(response);
    updateBackgroundImage(weatherCategory);
    displayCustomMessage(weatherCategory);

    $('#temp-value').html(Math.round(response.main.temp) + "&#176;");
    $('#humidity-value').html(response.main.humidity + "%");
    $('#pressure-value').html(response.main.pressure + " psa");
    $('#wind-speed-value').html(Math.round(response.wind.speed) + " " + getWindSpeedUnits());
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
        flexbox.append($('<div>').addClass("cell value-cell").html(Math.round(list[i].wind.speed) + " "  + getWindSpeedUnits()));
        flexboxesWrapper.append(flexbox);
    }
    $('.forecast-flexbox').html(flexboxesWrapper); //Use html() instead of append() so we don't end up with multiple tables
}

function handleError(error, functionName) {
    console.log("error in " + functionName + ": " + error.message);
    $('.location').html("Location not found, please try again.");
    $('.weather').addClass("hidden");
    $('.current-weather').addClass("hidden");
    $('.forecast').addClass("hidden");
}

function displayCustomMessage(weatherCategory) {
    console.log("displayCustomMessage: ", weatherCategory);
    let message = getCustomMessage(weatherCategory);
    //There is a possibility that there's no quote for this type of weather, if so we don't want to display an empty div
    if (message) {
        $('.custom-message').html(message);
    }
}

function getWindSpeedUnits() {
    return (weatherApi.units === "imperial") ? "mph" : "m/s";
}