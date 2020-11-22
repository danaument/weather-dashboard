var cityList;
var activeCity;

//get city list
var getCityList = function() {
    if (localStorage.getItem("cityList")) {
        cityList = JSON.parse(localStorage.getItem("cityList"));
    } else {
        cityList = [];
    }
}

//get active city
var getActiveCity = function () {
    if (localStorage.getItem("activeCity")) {
        activeCity = JSON.parse(localStorage.getItem("activeCity"));
    } else {
        activeCity = "";
    }
}

//build search history buttons
var buildSearchHistoryButtons = function() {
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
}

var searchActiveCity = function(city) {
    //ajax call for active city
    var asideGuts = $('<div>');
       
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
        url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`,
        method: "GET"
    }).then(function(response) {
        $('#asideEl').empty();
        city = city.charAt(0).toUpperCase() + city.toLowerCase().slice(1)
        todayIcon = response.weather[0].icon;
        todayTemp = response.main.temp;
        todayHum = response.main.humidity;
        todayWind = response.wind.speed;
        lon = response.coord.lon;
        lat = response.coord.lat;

        // 5 day forcast and uvi
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,current,minutely,alerts&appid=${apiKey}&units=imperial`
        }).then(function(response){
            uvIndex = response.daily[0].uvi;
            if (parseInt(uvIndex) < 3) {
                var uvClass = "greenUV"
            } else if (parseInt(uvIndex) >= 3 && parseInt(uvIndex) < 6) {
                var uvClass = "yellowUV"
            } else if (parseInt(uvIndex) >= 6 && parseInt(uvIndex) < 8) {
                var uvClass = "orangeUV"
            } else if (parseInt(uvIndex) >= 8 && parseInt(uvIndex) < 11) {
                var uvClass = "redUV"
            } else if (parseInt(uvIndex) >= 11) {
                var uvClass = "purpleUV"
            }
            asideGuts.empty();
            asideGuts.html(`
                <div id="todayWeather" class="border rounded p-4">
                    <div class="row">
                        <h2>${city} (${todayDate})</h2>
                        <img src="http://openweathermap.org/img/wn/${todayIcon}@2x.png" alt="weather icon">
                    </div>
                    <p>Temperature: ${todayTemp} °F</p>
                    <p>Humidity: ${todayHum}%</p>
                    <p>Wind Speed: ${todayWind} MPH</p>
                    <p>UV Index: <span id="uvSpan" class="p-2 rounded ${uvClass}">${uvIndex}</span></p>
                </div>
                <div id="fiveDay" class="mt-4">
                    <h3>5-Day Forecast:</h3>
                    <div class="d-flex justify-content-between" id="cardHolder">
                    </div>
                </div>
            `);
            $('#asideEl').append(asideGuts);
                
            for (i = 1; i < 6; i++) {
                var forecastCard = $('<div>');
                var forecastDate = response.daily[i].dt;
                forecastDate = moment(forecastDate, "X").format("MM/DD/YYYY");
                var forecastTemp = response.daily[i].temp.max;
                var forecastHum = response.daily[i].humidity;
                var forecastIcon = response.daily[i].weather[0].icon;
                forecastCard.html(`
                <div class="card-body">
                            <h5 class="card-title" id="dateDay1">${forecastDate}</h5>
                            <img src="http://openweathermap.org/img/wn/${forecastIcon}@2x.png" alt="weather icon" id="iconDay1">
                            <p id="tempDay1">Temp: ${forecastTemp} °F</p>
                            <p id="humDay1">Humidty: ${forecastHum}%</p>
                        </div>
                </div>
                `)
                $('#cardHolder').append(forecastCard);
            }
            localStorage.setItem("activeCity", JSON.stringify(city));
            if (!cityList.includes(city)) {
                cityList.push(city);
            }
            localStorage.setItem("cityList", JSON.stringify(cityList))
            getCityList();
            getActiveCity();
            buildSearchHistoryButtons();

        });
    })
    .catch(function() {
        if (activeCity.length === 0) {
            //render waiting stuff
            asideGuts.html(`<h6>Search for a city to check out the weather</h6>`);
            $('#asideEl').append(asideGuts);
        } else {
            if ($('#cityInput').val().trim()) {
                alert("Your search could not be completed.  Please check your spelling and try again.  Sorry for the inconvenience!")
            }
        }
    });
}

var init = function() {
    getCityList();
    getActiveCity();
    buildSearchHistoryButtons();
    if (activeCity) {
        searchActiveCity(activeCity);
    } else {
        $('#asideEl').html(`<h6>Search for a city to check out the weather</h6>`);
    }
}

init();

$(document).ready(function() {
    $("#searchForm").submit(function( event ) {
        event.preventDefault();
        var searchTerm = $('#cityInput').val().trim();
        if (searchTerm) {
            searchActiveCity(searchTerm);
            $('#cityInput').val('');
        }
    });

    $("#buttonList").click(function(event) {
        searchActiveCity(event.target.innerText)
    });
})