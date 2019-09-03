'use strict';

const User = require('../models/auth/userModel');

module.exports = {};

module.exports.modelLoader = ( request, response, next ) => {
  let model = request.params.model;
  let schema = require(`../models/content/${model}/${model}-schema.js`);
  let Model = require('../models/content/crudModel');
  request.model = new Model( schema );
  next();
};

module.exports.authenticate = ( request, response, next ) => {

  try {
    let path = request.originalUrl.split( '/' )[1];
    let [ authType, authString ] = request.headers.authorization.split(' ');
    if ( authType.toLowerCase() === 'basic' && path === 'signin' ) {
      return basic( authString );
    } else if ( authType.toLowerCase() === 'bearer' && [ 'products', 'categories' ].includes( request.params.model ) ) {
      return token( authString );
    } else response.send( 'Could not authenticate.' );
  } catch( error ){
    next( error);
  }

  function basic ( basicAuthString ) {
    let credentials = decode( basicAuthString );
    return User.basicAuth( credentials )
      .then( user => {
        if ( user ) {
          request.user = user.username;
          request.token = user.generateToken();
          next();
        }
      })
      .catch( error => next( error ) );
  }

  function decode ( authString ) {
    let buffer = Buffer.from( authString, 'base64' ).toString();
    let [ username, password ] = buffer.split(':');
    return { username, password };
  }

  function token ( tokenAuthString ) {
    return User.tokenAuth( tokenAuthString )
      .then( user => {
        if ( user ) {
          if ( roleCheck( user.role, request.method.toLowerCase())) {
            next();
          } else response.send( 'Are you sure you\'re in the right place?' );
        } else response.send( 'Bad token' );
      })
      .catch( error => next( error ) );
  }

  function roleCheck ( role, method ) {
    const key = {
      user : [ 'get', 'put' ],
      admin : [ 'get', 'post', 'put', 'delete' ],
    };
    return key[role].includes(method) ? true : false;
  }

};

