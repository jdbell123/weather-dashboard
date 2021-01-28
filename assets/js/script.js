// document ready statement to make sure the page fully loads before running this code
$(document).ready(function () {

  function renderPrevSearches() {
    $("#prevSearches").empty();
    var savedText = JSON.parse(localStorage.getItem("savedText"));
    if (savedText !== null) {
      for (var i = 0; i < savedText.length; i++) {
        var newDiv = $("<div>").addClass("p-3 border").text(savedText[i]);
        $("#prevSearches").prepend(newDiv);
        $(".p-3").css({
          "background-color": 'white',
          "color": "black",
          "cursor": "default"
        });
      }
    }
  }

  function saveSearch(textToSave) {
    var saveArray = JSON.parse(localStorage.getItem("savedText"));
    if (saveArray !== null) {
      // only save to localStorage if text not already present
      var textPresent = saveArray.includes(textToSave);
      if (!textPresent) {
        var newDiv = $("<div>").addClass("p-3 border").text(textToSave);
        newDiv.css({
          "background-color": 'white',
          "color": "black",
          "cursor": "default"
        });
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
          var myDate = new Date(response.daily[i].dt * 1000);
          var myDate2 = myDate.toLocaleDateString();

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


  // call initial functions for page to populate and work correctly
  renderPrevSearches();


  // on click event handler for search button.
  $("button").on("click", function () {
    var textFromScreen = $("#searchText").val().trim();
    // only call internal functions if the user has entered some search text on the screen.
    if (textFromScreen > "") {
      // blank out the search box text on the screen.
      $("#searchText").val("");
      // save the text entered on the screen into the previous searched area and into local storage.
      saveSearch(textFromScreen);
      // get the weather data for the text entered.
      getWeather(textFromScreen);
    }
  });

  // on click event handler for when user clicks on one of the previously searched items.
  $("#prevSearches").on("click", "div", function () {
    getWeather($(this).text());
  });

  // on mouseenter event handler for when user enters one of the previously searched items.
  $(document).on("mouseenter", ".p-3", (function () {
    $(this).css({
      // will set the attributes to a blue background and text white of the item the cursor is over.
      "background-color": '#0D6EFD',
      "color": "white"
    })
  }));

  // on mouseleave event handler for when user enters one of the previously searched items.
  $(document).on("mouseleave", ".p-3", (function () {
    $(this).css({
      // will reset the attributes back to the default for the item.
      "background-color": 'white',
      "color": "black"
    })
  }));

});  