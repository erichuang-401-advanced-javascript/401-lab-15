'use strict';

/**
 * 404 handler
 * @param request
 * @param response
 */
function error404 ( request, response ) {
  response.status(404).json('four, oh four.');
}

module.exports = error404;
