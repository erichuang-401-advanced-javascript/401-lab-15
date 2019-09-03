'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const user = new mongoose.Schema({
  username : { type : String, required : true, unique : true },
  password : { type : String, required : true },
  role : { type : String, default : 'user', enum : ['user', 'admin'] },
});

user.pre( 'save', function( next ) {
  bcrypt.hash( this.password, 10 )
    .then( hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch( console.error );
});

user.statics.basicAuth = function ( credentials ) {
  let query = { username : credentials.username };
  return this.findOne( query )
    .then( user => {
      if ( user && user.comparePassword( credentials.password ) ) {
        return user;
      } else console.log('Invalid password.');
    })
    .catch( error => console.log('Basic Auth:', error ) );
};

user.statics.tokenAuth = function ( token ) {
  let payload = jwt.verify( token, process.env.SECRET );
  return this.findById( payload.id )
    .then( user => {
      return user ? user : null;
    })
    .catch( error => console.log('Token Auth:', error) );
};

user.methods.comparePassword = function ( passwordString ) {
  return bcrypt.compare( passwordString, this.password )
    .then( valid => valid ? this : null )
    .catch( error => console.log('PW compare:', error ));
};

user.methods.generateToken = function () {
  let payload = { id : this._id };
  return jwt.sign( payload, process.env.SECRET );
};

module.exports = mongoose.model( 'user', user );
