let weatherApi = new WeatherApi();

$('#form').on('submit', function () {
    console.log('clicked submit');
    let input = $("#location").val();
    //Only call the API if location was given
    if (input) {
        fetchAndDisplayCurrentWeatherData(input);
        fetchAndDisplayWeatherForecastData(input);
    }
    //Or if they already chose to use their location, it should be saved in the hidden field
    else if ($("#location").attr('placeholder') === "Current location") {
        let cityID = $('.exact-location').html();
        fetchAndDisplayCurrentWeatherData(cityID);
        fetchAndDisplayWeatherForecastData(cityID);
    }
    return false;
});

$("#use-location").on('click tap', function() {
    //Takes a while to fetch geolocation, show loading message in meantime
    if (navigator.geolocation) {
        $('.location').html("Loading...");
        $('#location').attr('placeholder', "Current location");
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
        updateUnits("metric");
    }
    //Switch to Farenheit and update button text
    else {
        weatherApi.units = "imperial";
        $("#convert-button").html("Switch to Celsius");
        updateUnits("imperial");
    }
    //Call API again, using the city ID rather than the input to capture the most 
    //accurate location, even if the user searched using current location
    let cityID = $('.exact-location').html();
});

function updateUnits(newUnits) {
    //Current temp at top of page
    let currentTemp = $('.temperature #temp-value').html();
    let convertedTemp = convertTemp(currentTemp, newUnits);
    $('.temperature #temp-value').html(convertedTemp);

    //Current wind speed at top of page
    let currentSpeed = $('#wind-speed-value').html();
    let convertedSpeed = convertSpeed(currentSpeed, newUnits);
    $('#wind-speed-value').html(convertedSpeed);

    //Forecast temp values
    $('.temp-value').each(function(index, value) {
        console.log(value);
        let currentTempValue = $(value).html(); 
        console.log(currentTempValue);
        let newTempValue = convertTemp(currentTempValue, newUnits);
        // console.log(newTempValue);
        // value.html('test');
        $(value).html(newTempValue);
    });

    //Update wind speed values
    $('.wind-speed-value').each(function(index, value) {
        console.log(value);
        let currentSpeedValue = $(value).html(); 
        console.log(currentSpeedValue);
        let newSpeedValue = convertSpeed(currentSpeedValue, newUnits);
        // console.log(newTempValue);
        // value.html('test');
        $(value).html(newSpeedValue);
    });

    //Update wind speed units - mph vs m/s
    $('#current-wind-speed-units').html(getWindSpeedUnits());
    $('.wind-speed-units').html(getWindSpeedUnits());
}

function convertTemp(currentTemp, newUnits) {
    console.log("convert " + currentTemp + " to " + newUnits + " temp");
    let convertedTemp;
    currentTemp = parseInt(currentTemp);
    if (newUnits === "imperial") {
        convertedTemp = Math.round(currentTemp * 9 / 5 + 32);
    }
    else {
        convertedTemp = Math.round((currentTemp - 32) * 5 / 9);
    }
    console.log(convertedTemp);
    return convertedTemp;
}

function convertSpeed(currentSpeed, newUnits) {
    console.log("convert " + currentSpeed + " to " + newUnits + " speed");
    let convertedSpeed;
    currentSpeed = parseInt(currentSpeed);
    //m/s to mph: multiply the speed value by 2.237
    if (newUnits === "imperial") {
        convertedSpeed = Math.round((currentSpeed * 2.237));
    }
    //mph to m/s: divide the speed value by 2.237
    else {        
        convertedSpeed = Math.round(currentSpeed / 2.237);
    }
    console.log(convertedSpeed);
    return convertedSpeed;
}

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

    $('#temp-value').html(Math.round(response.main.temp)); //degree symbol added in HTML
    $('#humidity-value').html(response.main.humidity + "%");
    $('#pressure-value').html(response.main.pressure + " psa");
    $('#wind-speed-value').html(Math.round(response.wind.speed));
    $('#current-wind-speed-units').html(getWindSpeedUnits());
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
        // flexbox.append($('<div>').addClass("cell value-cell icon").html(getImage(list[i].weather[0].icon)));
        flexbox.append($('<div>').addClass("cell heading-cell description-heading").html("Description"));
        let description = $('<span>').addClass('description').html(formatDescription(list[i].weather[0].description));
        let image = getImage(list[i].weather[0].icon);
        // let descriptionCell = $('<div>').addClass("cell value-cell description").html(image);
        // descriptionCell.prepend(description);
        // flexbox.append(descriptionCell);
        flexbox.append($('<div>').addClass("cell value-cell description-cell").html(image).prepend(description));
        flexbox.append($('<div>').addClass("cell heading-cell").html("Temperature"));
        flexbox.append($('<div>').addClass("cell value-cell").html($('<span>').append($('<span>').addClass('temp-value').html(Math.round(list[i].main.temp))).append($('<span>').addClass('degree-symbol').html("&#176;"))));
        flexbox.append($('<div>').addClass("cell heading-cell").html("Humidity"));
        flexbox.append($('<div>').addClass("cell value-cell").html(list[i].main.humidity + "%"));
        flexbox.append($('<div>').addClass("cell heading-cell").html("Air Pressure"));
        flexbox.append($('<div>').addClass("cell value-cell").html(Math.round(list[i].main.pressure) + " psa"));
        flexbox.append($('<div>').addClass("cell heading-cell").html("Wind"));
        flexbox.append($('<div>').addClass("cell value-cell").html($('<span>').append($('<span>').addClass('wind-speed-value').html(Math.round(list[i].wind.speed))).append($('<span>').addClass('wind-speed-units').html(getWindSpeedUnits()))));
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