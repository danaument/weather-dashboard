


var renderPage = function() {
    //get city list
    if (localStorage.getItem("cityList")) {
        var cityList = JSON.parse(localStorage.getItem("cityList"));
    } else {
        var cityList = [];
    }
    //get active city
    if (localStorage.getItem("activeCity")) {
        var activeCity = JSON.parse(localStorage.getItem("activeCity"));
    } else {
        var activeCity = "";
    }
    //build search history buttons
    $('#buttonList').empty();
    for (i = 0; i < cityList.length; i++) {
        var pastSearchButton = $('<div>')
        if (cityList[i] === activeCity) {
            pastSearchButton.HTML(`<button type="button" class="list-group-item list-group-item-action active">${cityList[i]}</button>`)
        } else {
            pastSearchButton.HTML(`<button type="button" class="list-group-item list-group-item-action">${cityList[i]}</button>`)
        }
        $('#buttonList').append(pastSearchButton);
    }
    //ajax call for active city
    var asideGuts = $('<div>');
    asideGuts.empty();
    if (activeCity.length === 0) {
        //render waiting stuff
        asideGuts.HTML(`<h6>Search for a city to check out the weather</h6>`);
    } else {
        //call
        var apiKey = "f5f233cfe3163b61d82d69907e8f50ea"
        var todayDate = moment().format("MM/DD/YYYY");
        $.ajax({
                url: `http://api.openweathermap.org/data/2.5/weather?q=${activeCity}&appid=${apiKey}`,
                method: "GET"
            }).then(function(response) {
                console.log(response);
                console.log(response.coord.lon);
                var todayIcon = response.weather[0].icon;
                var todayTemp = response.main.temp;
                var todayHum = response.main.humidity;
                var todayWind = response.wind.speed;
                var lon = response.coord.lon;
                var lat = response.coord.lat;
                console.log(lon, lat);

                asideGuts.HTML(`
                    <div id="todayWeather" class="border rounded p-4">
                    <div class="row">
                        <h2>${activeCity} (${todayDate})</h2>
                        <img src="http://openweathermap.org/img/wn/${todayIcon}@2x.png" alt="weather icon">
                    </div>
                    <p>Temperature: ${todayTemp} °F</p>
                    <p>Humidity: ${todayHum}%</p>
                    <p>Wind Speed: ${todayWind} MPH</p>
                    <p>UV Index: <span id="uvSpan" class="uvClass">9.49</span></p>
                `);

                // UVI API => pass coordinates from weather API to UVI API
                $.ajax({
                    url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`,
                    method: "GET"
                }).then(function(response){
                    console.log(response);
                });
                
                // // 5 day forcast 
                $.ajax({
                    url: `http://api.openweathermap.org/data/2.5/forecast?q=${activeCity}&appid=${apiKey}`
                }).then(function(response){
                    console.log(response);
                });
            });

        
    }
    
    
}



var activeCity = "austin"
var apiKey = "f5f233cfe3163b61d82d69907e8f50ea"
        $.ajax({
                url: `http://api.openweathermap.org/data/2.5/weather?q=${activeCity}&appid=${apiKey}`,
                method: "GET"
            }).then(function(response) {
                console.log(response);
                console.log(response.weather[0].icon);
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
                    url: `http://api.openweathermap.org/data/2.5/forecast?q=${activeCity}&appid=${apiKey}`
                }).then(function(response){
                    console.log(response);
                });
            });



//api call

renderPage();







// function for removing old active and applying new one
// $(document).ready(function() {
//     $('selector').click(function() {
//         $('selector.active').removeClass("active");
//         $(this).addClass("active");
//     });
// });