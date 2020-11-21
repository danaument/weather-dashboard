var cityList;
var activeCity;

var renderPage = function() {
    //get city list
    if (localStorage.getItem("cityList")) {
        cityList = JSON.parse(localStorage.getItem("cityList"));
    } else {
        cityList = [];
    }
    //get active city
    if (localStorage.getItem("activeCity")) {
        activeCity = JSON.parse(localStorage.getItem("activeCity"));
    } else {
        activeCity = "Laredo";
    }
    //build search history buttons
    $('#buttonList').empty();
    for (i = 0; i < cityList.length; i++) {
        var pastSearchButton = $('<div>')
        if (cityList[i] === activeCity) {
            pastSearchButton.html(`<button type="button" class="list-group-item list-group-item-action active">${cityList[i]}</button>`)
        } else {
            pastSearchButton.html(`<button type="button" class="list-group-item list-group-item-action">${cityList[i]}</button>`)
        }
        $('#buttonList').append(pastSearchButton);
    }
    //ajax call for active city
    var asideGuts = $('<div>');
    asideGuts.empty();
    if (activeCity.length === 0) {
        //render waiting stuff
        asideGuts.html(`<h6>Search for a city to check out the weather</h6>`);
    } else {
        //call
        var apiKey = "f5f233cfe3163b61d82d69907e8f50ea"
        var todayDate = moment().format("MM/DD/YYYY");
        var todayIcon;
        var todayTemp;
        var todayHum;
        var todayWind;
        var lon;
        var lat;
        var uvIndex;

        $.ajax({
                url: `http://api.openweathermap.org/data/2.5/weather?q=${activeCity}&appid=${apiKey}&units=imperial`,
                method: "GET"
            }).then(function(response) {
                todayIcon = response.weather[0].icon;
                todayTemp = response.main.temp;
                todayHum = response.main.humidity;
                todayWind = response.wind.speed;
                lon = response.coord.lon;
                lat = response.coord.lat;

                // UVI API => pass coordinates from weather API to UVI API
                $.ajax({
                    url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`,
                    method: "GET"
                }).then(function(response){
                    console.log(response);
                    uvIndex = response.value;
                });
                
                // 5 day forcast 
                $.ajax({
                    url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,current,minutely,alerts&appid=${apiKey}&units=imperial`
                }).then(function(response){
                    console.log(response);
                    // for (i = 1; )
                });
            });
        asideGuts.html(`
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
        $('#asideEl').append(asideGuts);
    }
    
    
}



var activeCity = "austin"
var apiKey = "f5f233cfe3163b61d82d69907e8f50ea"
        $.ajax({
                url: `http://api.openweathermap.org/data/2.5/weather?q=${activeCity}&appid=${apiKey}&units=imperial`,
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
                    url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`,
                    method: "GET"
                }).then(function(response){
                    console.log(response);
                    console.log(response.value);
                });
                
                // 5 day forcast 
                $.ajax({
                    url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,current,minutely,alerts&appid=${apiKey}&units=imperial`
                }).then(function(response){
                    console.log(response);

                    for (i = 1; i < 6; i++) {
                        var forecastDate = response.daily[i].dt;
                        var forecastTemp = response.daily[i].temp.max;
                        var forecastHum = response.daily[i].humidity;
                        var forecastIcon = response.daily[i].weather[0].icon;
                        console.log(forecastDate, forecastTemp, forecastHum, forecastIcon);
                    }
                });
                

            });



//api call



$(document).ready(function() {
    renderPage();

    $("#searchForm").submit(function( event ) {
        event.preventDefault();
        console.log($('#cityInput').val().trim());
        var searchTerm = $('#cityInput').val().trim();
        cityList.push(searchTerm);
        console.log(cityList);
       
      });

})





// function for removing old active and applying new one
// $(document).ready(function() {
//     $('selector').click(function() {
//         $('selector.active').removeClass("active");
//         $(this).addClass("active");
//     });
// });