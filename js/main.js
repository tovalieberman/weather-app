$('#form').on('submit', function() {
    console.log('clicked submit');
    let location = $('#location').val();
    $('.response').html("You entered " + location);
    return false;
});