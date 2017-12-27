'use strict';

const service = require('../server/service');
const http = require('http');

const server = http.createServer(service);

server.listen(4000);

server.on('listening', () => {
  console.log(`Vee-time is listening on ${server.address().port} in ${service.get('env')}`);
})
