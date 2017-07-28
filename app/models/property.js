var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PropertySchema = new Schema({
  property_id: { type: Number, unique: true },
  zipcode: Number,
  bedrooms: Number,
  accomodates: Number,
  date_columns: Array
});

module.exports = mongoose.model('Property', PropertySchema);