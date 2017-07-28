var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var rentalAnalysis = require('./rentalAnalysis');
var linearRegression = require('./linearRegression');
var lRByZipCode = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
    console.log('incomming request.');
    next();
});

router.route('/price')
  .post(function(req, res) {

    var zipcode = req.body.zipcode;
    var bedroom_count = req.body.bedroom_count;

    if(!lRByZipCode.hasOwnProperty(zipcode)) {
      var { prices, bedrooms } = rentalAnalysis[`${zipcode}`]
      lRByZipCode[zipcode] = linearRegression(prices, bedrooms);
    }

    var { slope, intercept } = lRByZipCode[zipcode];
    var estimate = Math.round(slope * bedroom_count + intercept);

    //var slopeIntercept = linearRegression(pricesArray, bedroomsArray);
    res.send({ estimate })

  })
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('it\'s alive... ' + port);