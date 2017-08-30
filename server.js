var express = require('express');
var routes = require('./routes');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', routes);

app.listen(port, function() {
  console.log('Your local host is ready @ ::' + port);
});
