'use strict';

//load Environtment Variable from the .env
require('dotenv').config();

//declare Application Dependancies
const express = require('express');
const cors = require('cors');

//Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

//route syntax = app.<operation>('<route>', callback );
app.get('/', (request, response) => {
    response.send('Home Page!');
})

//the callback can be a separate function. Really makes readable.
//API routes
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', notFoundHandler);
app.use(errorHandler);

function locationHandler(request, response) {
    try {
        const geoData = require('./data/geo.json');
        const city = request.query.data;
        const locationData = new Location(city, geoData);
        response.status(200).send(locationData);
    }
    catch (error) {
        //some function or error message
        errorHandler('So sorry,something went wrong.', request, response);
    }
}
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData.results[0].formatted_address;
    this.latitude = geoData.results[0].geometry.location.lat;
    this.longitude = geoData.results[0].geometry.location.lng;
}


function weatherHandler(request, response) {
    try {
        const darkskyData = require('./data/darksky.json');
        const weatherSummaries = [];
        darkskyData.daily.data.forEach(day => {
            weatherSummaries.push(new Weather(day));
        });
        response.status(200).send(weatherSummaries);
    }
    catch (error) {
        errorHandler('So sorry, something went wrong.', request, response);
    }
}

function Weather(day) {
    this.forecast = day.summary;
    this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

function notFoundHandler(request, response) {
    response.status(404).send('huh?');
}

function errorHandler(error, request, response) {
    console.log('ERROR', error);
    response.status(500).send(error);
}


//Ensure the server is listening for requests
// THIS MUST BE AT THE BOTTOM OF THE FILE!!!!
app.listen(PORT, () => console.log(`The server is up, listening on ${PORT}`));
