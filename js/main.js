$('#form').on('submit', function() {
    console.log('clicked submit');
    let location = $('#location').val();
    let weatherList = ["sunny", "cloudy", "rainy", "stormy"];
    let weatherRand = Math.floor(Math.random() * weatherList.length);
    let weather = weatherList[weatherRand];
    $('.response').html(`You entered ${location}. The weather in ${location} is ${weather}`);
    $('#weather-background').removeClass();
    $('#weather-background').addClass(weather);
    return false;
});
