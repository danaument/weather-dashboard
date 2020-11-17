

var queryURL = "api.openweathermap.org/data/2.5/weather?q=austin&appid=f5f233cfe3163b61d82d69907e8f50ea"



//api call
var getCityWeather = function () {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        consol.log(response);
    
        // UVI API => pass coordinates from weather API to UVI API
        // $.ajax({}).then(function(response){
    
        // });
    
        // // 5 day forcast 
        // $.ajax({}).then(function(response){
    
        // });
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