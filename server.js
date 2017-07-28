var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var rentalAnalysis = require('./rentalAnalysis');
var linearRegression = require('./linearRegression');
var lRByZipCode = {};
var bRByZipCode = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

router.route('/price')
  .post(function(req, res) {
    // REQ PARAMS
    var zipcode = req.body.zipcode;
    var bedroom_count = req.body.bedroom_count;

    // CHECK IF OUR LRHASH HAS LR OBJ FOR REQUEST'S ZIP
    if(!lRByZipCode.hasOwnProperty(zipcode)) {
      var { prices, bedrooms } = rentalAnalysis[zipcode]
      lRByZipCode[zipcode] = linearRegression(prices, bedrooms);
    }

    // DESTRUCTURE LR DATA AND CALCULATE PRICE
    var { slope, intercept } = lRByZipCode[zipcode];
    var price = Math.round(slope * bedroom_count + intercept);

    res.send({ price })
  });

  router.route('/booking_rate')
    .post(function(req, res) {
      // REQ PARAMS
      var zipcode = req.body.zipcode;
      var bedroom_count = req.body.bedroom_count;

      // CHECK IF OUR BRHASH HAS BR FOR REQUEST'S ZIP
      if(!bRByZipCode.hasOwnProperty(zipcode)) {
        var { prices, reserved } = rentalAnalysis[zipcode]
        bRByZipCode[zipcode] =  Math.round(100 * (reserved.length/(prices.length + reserved.length))) / 100;
      }

      // DESTRUCTURE LR DATA AND CALCULATE PRICE
      var booking_rate = bRByZipCode[zipcode];

      res.send({ booking_rate })
    });

app.use('/api', router);

app.listen(port);
console.log('it\'s alive... ' + port);