// document ready statement to make sure the page fully loads before running this code
$(document).ready(function () {

  // function to render previous searched text to the page.
  function renderPrevSearches() {
    // empty out previously built content so the data doesn't repeat.
    $("#prevSearches").empty();
    // retrieve previous search data from local storage.
    var savedText = JSON.parse(localStorage.getItem("savedText"));
    // if there isn't any data in local storage for this app then no need to do anything here.
    if (savedText !== null) {
      // if there is data in local storage then loop thru the saved data.
      for (var i = 0; i < savedText.length; i++) {
        // create a new div element on the page to house the saved data.
        var newDiv = $("<div>").addClass("p-3 border").text(savedText[i]);
        // prepend the div to the page.
        $("#prevSearches").prepend(newDiv);
        // add default styling to the new div that has just been added.
        $(".p-3").css({
          "background-color": 'white',
          "color": "black",
          "cursor": "default"
        });
      }
    }
  }

  // function to save the text entered on the screen into the previous searched area and into local storage.
  function saveSearch(textToSave) {
    // retrieve previous search data from local storage.
    var saveArray = JSON.parse(localStorage.getItem("savedText"));
    // check to see if there is any data currently stored in local storage.
    if (saveArray !== null) {
      // only save to localStorage if text not already present.
      var textPresent = saveArray.includes(textToSave);
      // if text not already present in local storage then push text to local storage.
      if (!textPresent) {
        saveArray.push(textToSave);
        localStorage.setItem("savedText", JSON.stringify(saveArray));
        // call function to render previouss searched text to the page.
        renderPrevSearches();
      }
    }
    else {
      // no data in local storage so do initial empty array.
      saveArray = [];
      // push the searched text to the array.
      saveArray.push(textToSave);
      // save the array to local storage.
      localStorage.setItem("savedText", JSON.stringify(saveArray));
      // call function to render previouss searched text to the page.
      renderPrevSearches();
    }
  }

  // function to get the initial weather data for the searched text.
  function getWeather(searchText) {
    // api key for openweathermap.org
    var apiKey = "4310461d905ef8a14c82aaac5e632e1c";
    // empty out previously displayed weather (both current and future firecasts).
    $("#currentForecast").empty();
    $("#futureForecast").empty();
    // create queryURL for initial api call.
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      searchText +
      "&appid=" +
      apiKey +
      "&units=imperial";
    // do ajax call to invoke api.
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // from the response of the api we are interested in getting the latitude and longitude of the entered text.
      // we pass this data to a function that will get the full weather data.
      getWeatherData(response.coord.lat, response.coord.lon);
    });

    // function to get the full weather data for the latitude and longitude that has been passed in.
    function getWeatherData(lat, lon) {
      // create URL for api call.
      getWeatherURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey +
        "&units=imperial";
      // do ajax call to invoke api.
      $.ajax({
        url: getWeatherURL,
        method: "GET",
      }).then(function (response) {
        // after api returns data use data to build the current weather card on the page.
        var uvIndex = response.current.uvi
        // convert date into readable date format string.
        var currDate = new Date(response.current.dt * 1000).toLocaleDateString();
        var currCardDiv = $("<div>").addClass("card");
        var currCardBodyDiv = $("<div>").addClass("card-body");
        var currH2Div = $("<h2>").addClass("mb-4").text(searchText + " (" + currDate + ")");
        // get the weather icon and build an img tag.
        var currWeatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png");
        // add text attribute for image.
        currWeatherIcon.attr("title", response.current.weather[0].description);
        var currTemp = $("<p>").text("Temperature: " + response.current.temp + " °F");
        var currHumidity = $("<p>").text("Humidity: " + response.current.humidity + " %");
        var currWindSpeed = $("<p>").text("Wind Speed: " + response.current.wind_speed + " MPH");
        var currUvIndex = $("<p>").text("UV Index: ");
        // make a small button so that we can change the color based on the value of the UV index.
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

        // take the current weather elements that were created above and append them to each other and then finally to the actual screen.
        currUvIndex.append(currUvIndexBtn);
        currH2Div.append(currWeatherIcon);
        currCardBodyDiv.append(currH2Div, currTemp, currHumidity, currWindSpeed, currUvIndex);
        currCardDiv.append(currCardBodyDiv);
        $("#currentForecast").append(currCardDiv);

        // create the future weather area of the page.
        futureH3Div = $("<h3>").text("5-Day Forecast:");
        $("#futureForecast").append(futureH3Div);

        // add a new row div so that we can append the future weather cards to it.
        var newRow = $("<div>").addClass("row");
        $("#futureForecast").append(newRow);
        // loop thru the response data 5 times to get the next 5 days worth of weather data.
        for (var i = 1; i < 6; i++) {
          // build the future weather card elements.
          var futureColDiv = $("<div>").addClass("col-md-2");
          var futureCardBodyDiv = $("<div>").addClass("card-body bg-primary text-white");
          var futureCardDiv = $("<div>").addClass("card");
          // convert date into readable date format string.
          var futureDate = $("<h5>").text(new Date(response.daily[i].dt * 1000).toLocaleDateString());
          // get the weather icon and build an img tag.
          var futureWeatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png");
          // add text attribute for image.
          futureWeatherIcon.attr("title", response.daily[i].weather[0].description);
          var futureTemp = $("<p>").text("Temp: " + response.daily[i].temp.max + " °F");
          var futureHumidity = $("<p>").text("Humidity: " + response.daily[i].humidity + "%");

          // take the future weather elements that were created above and append them to each other and then finally to the actual screen.
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