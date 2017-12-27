'use strict';

const express = require('express');
const service = express();
const request = require('superagent');

function getCoordinates(location){
  return `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GOOGLE_GEO_API_KEY}`;
}

service.get('/service/:location', (req, res, next) => {
  request.get(getCoordinates(req.params.location), (err, response) => {
    if(err){
      console.log(err);
      return res.sendStatus(500);
    }
    res.json(response.body.results[0].geometry.location);
  });
});

module.exports = service;
