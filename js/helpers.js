function permissionDenied(error) {
    if (error.code === 1) {
        $('.location').html("Permission denied by browser, please try again or type a location in the box.");
    }
    else {
        $('.location').html("Something went wrong, please try again or type a location in the box.");
    }
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
