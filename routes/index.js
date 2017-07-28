const routes = require('express').Router();
const path = require('path')

const price = require('./price');
const booking_rate = require('./booking_rate');
const earnings = require('./earnings');

routes.use('/price', price);
routes.use('/booking_rate', booking_rate);
routes.use('/earnings', earnings);

module.exports = routes;