var router = require('express').Router();
var rentalAnalysis = require('../rentalAnalysis');
var linearRegression = require('../linearRegression');

var linearRegressionByZip = {};
var bookingRateByZip = {};

// destructure linear regression object for requested zip and return price
function getPrice(zipcode, bedroom_count) {
  var { slope, intercept } = linearRegressionByZip[zipcode];
  return Math.round(slope * bedroom_count + intercept);
}

// lookup booking_rate
function getBookingRate(zipcode) {
  return bookingRateByZip[zipcode];
}

// calculate earnings
function getEarnings(booking_rate, days, price) {
  return Math.round(booking_rate * days * price)
}

// get Date
function parseDate(date) {
  var ymd = date.split('-');
  return new Date(ymd[0], ymd[1]-1, ymd[2]);
}

// calculate days between two Dates
function numberOfDays(start, end) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((end - start) / millisecondsPerDay);
}

// middleware to check if we have linearRegression and bookingRate obj for a zip before each request
router.use('/', function(req, res, next) {
  var zipcode = req.body.zipcode;
  var { prices, bedrooms, reserved } = rentalAnalysis[zipcode];
  // if lR by zip not found calculate and store it
  if(!linearRegressionByZip.hasOwnProperty(zipcode)) {
    linearRegressionByZip[zipcode] = linearRegression(prices, bedrooms);
  }
  // if bR by zip not found calculate and store it
  if(!bookingRateByZip.hasOwnProperty(zipcode)) {
    bookingRateByZip[zipcode] = Math.round(100 * (reserved.length / (prices.length + reserved.length))) / 100;
  }
  next();
});

// middle where to handle if the service can’t provide a reasonable estimation for the given inputs
router.use('/', function(err, req, res, next) {
  if(err) {
    res.status(404).send('Oh no, 404! Something broke!')
  }
  next();
});

// routes
router.route('/price').post(function(req, res) {
    // request parameters
    var zipcode = req.body.zipcode;
    var bedroom_count = req.body.bedroom_count;
    var price = getPrice(zipcode, bedroom_count);
    res.send({ price });
  });

router.route('/booking_rate').post(function(req, res) {
    // request parameters
    var zipcode = req.body.zipcode;
    var bedroom_count = req.body.bedroom_count;
    var booking_rate = getBookingRate(zipcode);
    res.send({ booking_rate });
  });

router.route('/earnings').post(function(req, res) {
    // request parameters
    var start_date = parseDate(req.body.start_date); //'2015-01-01'
    var end_date = parseDate(req.body.end_date); //'2015-07-01'
    var zipcode = req.body.zipcode;
    var bedroom_count = req.body.bedroom_count;

    //variables to calculate earnings
    var days = numberOfDays(start_date, end_date); 
    var price = getPrice(zipcode, bedroom_count);
    var booking_rate = getBookingRate(zipcode);
    
    var earnings = getEarnings(booking_rate, days, price);
    res.send({ earnings });
  });

module.exports = router;
