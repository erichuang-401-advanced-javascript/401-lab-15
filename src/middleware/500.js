'use strict';

function errorHandler ( error, request, response ){
  console.log('500\'d, ', error);
  response.status(500).json('Internal server error');
}

module.exports = errorHandler;
