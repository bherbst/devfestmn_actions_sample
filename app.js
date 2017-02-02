'use strict';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let weather = require('weather-js');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

const TEMPERATURE_ACTION = 'get_temperature';
const HUMIDITY_ACTION = 'get_humidity';
const LOCATION_ARGUMENT = 'location';

// [START DevFest MN Sample Actions]
app.post('/', function (req, res) {
  const assistant = new Assistant({request: req, response: res});

  // Get the temperature
  function getTemperature(assistant) {
    let location = assistant.getArgument(LOCATION_ARGUMENT);
    weather.find({search: location, degreeType: 'F'}, function (err, data) {
      if (err) {
        console.warn(err);
        assistant.tell("I couldn't find weather data for " + location);
      } else {
        let temp = data[0].current.temperature;
        assistant.tell("It is " + temp + " degrees in " + location);
      }
    });
  }

  // Get the humidity
  function getHumidity(assistant) {
    let location = assistant.getArgument(LOCATION_ARGUMENT);
    weather.find({search: location, degreeType: 'F'}, function (err, data) {
      if (err) {
        console.warn(err);
        assistant.tell("I couldn't find weather data for " + location);
      } else {
        let humidity = data[0].current.humidity;
        assistant.tell("The humidity is " + humidity + " percent in " + location);
      }
    });
  }

  let actionMap = new Map();
  actionMap.set(TEMPERATURE_ACTION, getTemperature);
  actionMap.set(HUMIDITY_ACTION, getHumidity);

  assistant.handleRequest(actionMap);
});
// [END DevFest MN Sample Actions]

if (module === require.main) {
  // [START server]
  // Start the server
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
  // [END server]
}

module.exports = app;
