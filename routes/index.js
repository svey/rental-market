var router = require('express').Router();
var path = require('path')

var rentalAnalysis = require('../rentalAnalysis');
var linearRegression = require('../linearRegression');

var lRByZip = {};
var bRByZip = {};

// price endpoint
router.route('/price').post(function(req, res) {
    // request parameters
    var zipcode = req.body.zipcode;
    var bedroom_count = req.body.bedroom_count;

    // check if the linear regression hash has info for the requested zip, if not add it
    if(!lRByZip.hasOwnProperty(zipcode)) {
      var { prices, bedrooms } = rentalAnalysis[zipcode]
      lRByZip[zipcode] = linearRegression(prices, bedrooms);
    }

    // destructure linear regression object for requested zip and calculate price
    var { slope, intercept } = lRByZip[zipcode];
    var price = Math.round(slope * bedroom_count + intercept);

    res.send({ price })
  });

// booking_rate endpoint
router.route('/booking_rate').post(function(req, res) {
    // request parameters
    var zipcode = req.body.zipcode;
    var bedroom_count = req.body.bedroom_count;

    // check if our booking rate hash has info for the requested zip, if not add it
    if(!bRByZip.hasOwnProperty(zipcode)) {
      var { prices, reserved } = rentalAnalysis[zipcode]
      bRByZip[zipcode] = Math.round(100 * (reserved.length/(prices.length + reserved.length))) / 100;
    }

    // calculate booking rate
    var booking_rate = bRByZip[zipcode];

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

    var days = numberOfDays(start_date, end_date)
    
    // check if the linear regression hash has info for the requested zip, if not add it
    if(!lRByZip.hasOwnProperty(zipcode)) {
      var { prices, bedrooms } = rentalAnalysis[zipcode]
      lRByZip[zipcode] = linearRegression(prices, bedrooms);
    }

    // destructure linear regression object for requested zip and calculate price
    var { slope, intercept } = lRByZip[zipcode];
    var price = Math.round(slope * bedroom_count + intercept);


    // check if our booking rate hash has info for the requested zip, if not add it
    if(!bRByZip.hasOwnProperty(zipcode)) {
      var { prices, reserved } = rentalAnalysis[zipcode]
      bRByZip[zipcode] = Math.round(100 * (reserved.length/(prices.length + reserved.length))) / 100;
    }

    var booking_rate = bRByZip[zipcode];
    var earnings = Math.round(booking_rate * days * price);

    res.send({ earnings })
  });

module.exports = router;