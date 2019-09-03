'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const contentRoute = express.Router();
const helper = require('../middleware/helpers');
const modelLoader = helper.modelLoader;
const authenticate = helper.authenticate;

contentRoute.param('model', modelLoader);
contentRoute.get('/content/:model', authenticate, get);
contentRoute.post('/content/:model', authenticate, create);
contentRoute.put('/content/:model', authenticate, update);
contentRoute.delete('/content/:model', authenticate, remove);

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
