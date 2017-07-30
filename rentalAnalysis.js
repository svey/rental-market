var data = require('./data.json')

var sortDataByZip = function(array) {
  var zipHash = {};

  for(var i = 0; i < array.length; i++) {
    var zipcode = array[i].zipcode
    if(!zipHash.hasOwnProperty(zipcode)) {
      zipHash[zipcode] = {
        prices: [],
        bedrooms: [],
        reserved: []
      };
    };
    
    for(var key in array[i]) {
      switch(key) {
        case 'property_id':
          break;
        case 'zipcode':
          break;
        case 'bedrooms':
          break;
        case 'accomodates':
          break;
        default:
          if(!isNaN(array[i][key])){
            zipHash[zipcode].prices.push(array[i][key]);
            zipHash[zipcode].bedrooms.push(array[i].bedrooms);
          } else if(array[i][key] === 'reserved') {
            zipHash[zipcode].reserved.push('reserved')
          }
      }
    }
  }
  return zipHash;
}

var rentalAnalysis = sortDataByZip(data);


module.exports = rentalAnalysis;