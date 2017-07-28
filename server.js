var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var rentalAnalysis = require('./rentalAnalysis');
var linearRegression = require('./linearRegression');
var lRByZipCode = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

// MIDDLEWARE TO SEE INCOMMING REQUEST IN THE TERMINAL

// router.use(function(req, res, next) {
//     console.log('incomming request.');
//     next();
// });

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

app.use('/api', router);

app.listen(port);
console.log('it\'s alive... ' + port);