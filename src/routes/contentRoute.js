'use strict';

const express = require('express');
const contentRoute = express.Router();
const modelLoader = require('../middleware/helpers').modelLoader;

contentRoute.param('model', modelLoader);
contentRoute.get('/:model', get);
contentRoute.post('/:model', create);
contentRoute.put('/:model', update);
contentRoute.delete('/:model', remove);

function get ( request, response, next ) {
  if ( request.query.id ) {
    return request.model.read( request.query.id )
      .then( results => response.status(200).json( results ) )
      .catch( error => next( error ) );
  } else {
    return request.model.read()
      .then( results => response.status(200).json( results ) )
      .catch( error => next( error ) );
  }
}

function create ( request, response, next ) {
  if ( request.body ) {
    return request.model.create( request.body )
      .then( results => response.status(200).json( results ) )
      .catch( error => next( error ) );
  } else response.send('Could not create.');
}

function update ( request, response, next ) {
  if ( request.query.id && request.body ) {
    return request.model.update( request.query.id, request.body )
      .then( results => response.status(200).json( results ) )
      .catch( error => next( error ) );
  } else response.send('Could not update.');
}

function remove ( request, response, next ) {
  if ( request.query.id ) {
    return request.model.remove( request.query.id )
      .then( results => response.status(200).json( results ) )
      .catch( error => next( error ) );
  } else response.send('Could not delete.');
}

module.exports = contentRoute;
