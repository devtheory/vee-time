'use strict';

const express = require('express');
const service = express();
const baseUrl = 'https://maps.googleapis.com/maps/api';
const request = require('superagent');
const moment = require('moment');

function getCoordinates(location){
  return `${baseUrl}/geocode/json?address=${location}&key=${process.env.GOOGLE_GEO_API_KEY}`;
}

function getTimeFromCoordinates(location, timestamp){
  return `${baseUrl}/timezone/json?location=${location.lat},${location.lng}&timestamp=${timestamp}&key=${process.env.GOOGLE_TIMEZONE_API_KEY}`;
}

service.get('/service/:location', (req, res, next) => {
  request.get(getCoordinates(req.params.location), (err, response) => {
    if(err){
      console.log(err);
      return res.sendStatus(500);
    }

    const location = response.body.results[0].geometry.location; //lat long
    const timestamp = +moment().format('X');

    request.get(getTimeFromCoordinates(location, timestamp), (err, response) => {
      if(err){
        console.log(err);
        return res.sendStatus(500);
      }

      const result = response.body;
      const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

      res.json({result: timeString});
    });
  });
});

module.exports = service;
