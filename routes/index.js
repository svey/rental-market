var router = require('express').Router();
var path = require('path')

var rentalAnalysis = require('../rentalAnalysis');
var linearRegression = require('../linearRegression');

var linearRegressionByZip = {};
var bookingRateByZip = {};

var zipCalculations = function(zipcode) {
  var { prices, bedrooms, reserved } = rentalAnalysis[zipcode];
  if(!linearRegressionByZip.hasOwnProperty(zipcode)) {
    linearRegressionByZip[zipcode] = linearRegression(prices, bedrooms);
  }
  if(!bookingRateByZip.hasOwnProperty(zipcode)) {
    bookingRateByZip[zipcode] = Math.round(100 * (reserved.length/(prices.length + reserved.length))) / 100;
  }
}

//middleware to check if we have lR and bR for a zip at each request
router.use('/', function(req, res, next) {
  var zipcode = req.body.zipcode
  zipCalculations(zipcode)
  next();
});

// price endpoint
router.route('/price').post(function(req, res) {
    // request parameters
    var zipcode = req.body.zipcode;
    var bedroom_count = req.body.bedroom_count;

    // destructure linear regression object for requested zip and calculate price
    var { slope, intercept } = linearRegressionByZip[zipcode];
    var price = Math.round(slope * bedroom_count + intercept);

    res.send({ price })
  });

// booking_rate endpoint
router.route('/booking_rate').post(function(req, res) {
    // request parameters
    var zipcode = req.body.zipcode;
    var bedroom_count = req.body.bedroom_count;

    // lookup booking rate
    var booking_rate = bookingRateByZip[zipcode];

    res.send({ booking_rate })
  });

router.route('/earnings').post(function(req, res) {
    // request parameters
    var parseDate = function(str) {
      var ymd = str.split('-');
      return new Date(ymd[0], ymd[1]-1, ymd[2]);
    }

    var numberOfDays = function(start, end) {
      var millisecondsPerDay = 24 * 60 * 60 * 1000;
      return Math.round((end - start) / millisecondsPerDay);
    }

    var start_date = parseDate(req.body.start_date); //'2015-01-01'
    var end_date = parseDate(req.body.end_date); //'2015-07-01'
    var zipcode = req.body.zipcode;
    var bedroom_count = req.body.bedroom_count;

    var { slope, intercept } = linearRegressionByZip[zipcode];

    var days = numberOfDays(start_date, end_date)
    var price = Math.round(slope * bedroom_count + intercept);
    var booking_rate = bookingRateByZip[zipcode];
    
    var earnings = Math.round(booking_rate * days * price);

    res.send({ earnings })
  });

module.exports = router;