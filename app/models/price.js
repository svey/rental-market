var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PriceSchema = new Schema({
  zipcode: Number,
  bedroom_count: Number
});

module.exports = mongoose.model('Price', PriceSchema);