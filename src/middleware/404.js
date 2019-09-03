'use strict';

function error404 ( request, response ) {
  response.status(404).json('four, oh four.');
}

module.exports = error404;
