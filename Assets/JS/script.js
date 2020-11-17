var cityName = "austin"
var apiKey = "f5f233cfe3163b61d82d69907e8f50ea"
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=austin&appid=f5f233cfe3163b61d82d69907e8f50ea"



//api call
var getCityWeather = function () {
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log(response.coord.lon);
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        console.log(lon, lat);

        // UVI API => pass coordinates from weather API to UVI API
        $.ajax({
            url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`,
            method: "GET"
        }).then(function(response){
            console.log(response);
        });
        
        // // 5 day forcast 
        $.ajax({
            url: `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`
        }).then(function(response){
            console.log(response);
        });
    });
}



getCityWeather();








// function for removing old active and applying new one
// $(document).ready(function() {
//     $('selector').click(function() {
//         $('selector.active').removeClass("active");
//         $(this).addClass("active");
//     });
// });