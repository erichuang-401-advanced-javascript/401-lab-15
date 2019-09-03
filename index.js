'use strict';

require('dotenv').config();
const app = require('./src/app').start;
const mongoose = require('mongoose');
const options = {
  useNewUrlParser:true,
  useCreateIndex: true,
  useFindAndModify: false,
};
mongoose.connect( process.env.MONGODB_URI, options );

app(process.env.PORT || 3000 );
