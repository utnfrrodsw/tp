const express = require('express');
const config = require('./config');

const app = express();

app.set('port', config.app.port)

module.exports = app;