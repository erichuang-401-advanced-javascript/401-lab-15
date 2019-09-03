'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const contentRoute = require('./routes/contentRoute');
const authRoutes = require('./routes/authRoutes');
const error404 = require('./middleware/404');
const errorHandler = require('./middleware/500');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//routes
app.use( authRoutes );
app.use( contentRoute );

//all errors down here
app.use(error404);
app.use(errorHandler);

module.exports = {
  server : app,
  start : ( port ) => {
    app.listen( port, () => {
      console.log('BATTLECRUISER OPERATIONAL:', port);
    });
  },
};

