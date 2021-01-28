// document ready statement to make sure the page fully loads before running this code
$(document).ready(function () {

    renderPrevSearches();
  
    $("button").on("click", function () {
      console.log("button clicked!");
      var textFromScreen = $("#searchText").val().trim();
      console.log(textFromScreen);
      if (textFromScreen > "") {
        $("#searchText").val("");
        saveSearch(textFromScreen);
        getWeather(textFromScreen);
      }
    });
  
    $("#prevSearches").on("click", "div", function () {
      getWeather($(this).text());
    });
  
    function renderPrevSearches() {
  
      $("#prevSearches").empty();
  
      var savedText = JSON.parse(localStorage.getItem("savedText"));
      console.log("savedText: " + savedText)
      if (savedText !== null) {
        for (var i = 0; i < savedText.length; i++) {
          var newDiv = $("<div>").addClass("p-3 border").text(savedText[i]);
          $("#prevSearches").prepend(newDiv);
          $(".p-3").css({
            "background-color": 'white',
            "color": "black"});
        }
      }
    }
  
    function saveSearch(textToSave) {
      var saveArray = JSON.parse(localStorage.getItem("savedText"));
      console.log(saveArray);
      if (saveArray !== null) {
        // Only save to localStorage if text not already present
        var textPresent = saveArray.includes(textToSave);
        if (!textPresent) {
          var newDiv = $("<div>").addClass("p-3 border").text(textToSave);
          newDiv.css({
            "background-color": 'white',
            "color": "black",
            "cursor": "default"});
          $("#prevSearches").prepend(newDiv);
          saveArray.push(textToSave);
          localStorage.setItem("savedText", JSON.stringify(saveArray));
        }
      }
      else {
        saveArray = [];
        saveArray.push(textToSave);
        localStorage.setItem("savedText", JSON.stringify(saveArray));
        renderPrevSearches();
      }
    }
  
    function getWeather(searchText) {
      var apiKey = "4310461d905ef8a14c82aaac5e632e1c";
  
      $("#currentForecast").empty();
      $("#futureForecast").empty();
  
      var queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        searchText +
        "&appid=" +
        apiKey +
        "&units=imperial";
  
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        getWeatherData(response.coord.lat, response.coord.lon);
      });
  
      function getWeatherData(lat, lon) {
        getWeatherURL =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=" +
          apiKey +
          "&units=imperial";
        $.ajax({
          url: getWeatherURL,
          method: "GET",
        }).then(function (response) {
          console.log(response);
  
          var uvIndex = response.current.uvi
          var currDate = new Date(response.current.dt * 1000).toLocaleDateString();
          var currCardDiv = $("<div>").addClass("card");
          var currCardBodyDiv = $("<div>").addClass("card-body");
          var currH2Div = $("<h2>").addClass("mb-4").text(searchText + " (" + currDate + ")");
          var currWeatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png");
          currWeatherIcon.attr("title", response.current.weather[0].description);
          var currTemp = $("<p>").text("Temperature: " + response.current.temp + " °F");
          var currHumidity = $("<p>").text("Humidity: " + response.current.humidity + " %");
          var currWindSpeed = $("<p>").text("Wind Speed: " + response.current.wind_speed + " MPH");
          var currUvIndex = $("<p>").text("UV Index: ");
          var currUvIndexBtn = $("<span>").addClass("btn btn-sm").text(response.current.uvi);
  
          // Set background color of button depending on UV Index value
          if (uvIndex < 3) {
            currUvIndexBtn.css("background-color", "#43B91D");
          }
          else if (uvIndex < 6) {
            currUvIndexBtn.css("background-color", "#FCC721");
          }
          else if (uvIndex < 8) {
            currUvIndexBtn.css("background-color", "#F9741A");
          }
          else if (uvIndex < 11) {
            currUvIndexBtn.css("background-color", "#F81116");
          }
          else {
            currUvIndexBtn.css("background-color", "#866FFF");
          }
  
          currUvIndex.append(currUvIndexBtn);
          currH2Div.append(currWeatherIcon);
          currCardBodyDiv.append(currH2Div, currTemp, currHumidity, currWindSpeed, currUvIndex);
          currCardDiv.append(currCardBodyDiv);
          $("#currentForecast").append(currCardDiv);
  
          futureH3Div = $("<h3>").text("5-Day Forecast:");
          $("#futureForecast").append(futureH3Div);
  
          var newRow = $("<div>").addClass("row");
          $("#futureForecast").append(newRow);
          for (var i = 1; i < 6; i++) {
            console.log(
              "************************************************************"
            );
            console.log("Day Date: " + response.daily[i].dt);
            var myDate = new Date(response.daily[i].dt * 1000);
            console.log("myDate: " + myDate);
            var myDate2 = myDate.toLocaleDateString();
            console.log("myDate(Local): " + myDate2);
            console.log(
              "Day Forecast: " + response.daily[i].weather[0].description
            );
            console.log("Day Forecast Icon: " + response.daily[i].weather[0].icon);
            // "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
            console.log("Day Temp: " + response.daily[i].temp.max);
            console.log("Day Humidity: " + response.daily[i].humidity);
  
            var futureColDiv = $("<div>").addClass("col-md-2");
            var futureCardBodyDiv = $("<div>").addClass("card-body bg-primary text-white");
            var futureCardDiv = $("<div>").addClass("card");
            var futureDate = $("<h5>").text(myDate2);
            var futureWeatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png");
            futureWeatherIcon.attr("title", response.daily[i].weather[0].description);
            var futureTemp = $("<p>").text("Temp: " + response.daily[i].temp.max + " °F");
            var futureHumidity = $("<p>").text("Humidity: " + response.daily[i].humidity + "%");
  
  
            futureCardBodyDiv.append(futureDate, futureWeatherIcon, futureTemp, futureHumidity);
            futureCardDiv.append(futureCardBodyDiv);
            futureColDiv.append(futureCardDiv);
            $("#futureForecast .row").append(futureColDiv);
          }
        });
      }
    }
  
    $(document).on("mouseenter", ".p-3", (function() {
      $(this).css({
        "background-color": '#0D6EFD',
        "color": "white",
        "cursor": "default"
      })
    }));
  
    $(document).on("mouseleave", ".p-3", (function() {
      $(this).css({
        "background-color": 'white',
        "color": "black",
        "cursor": "default"
      })
    }));
  
  });  