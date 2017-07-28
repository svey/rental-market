var data = require('./data.json')
//var parsedData = JSON.parse(data);

var sortPropertiesByZip = function(array) {
  var zipHash = {}

  for(var i = 0; i < array.length; i++) {
    if(zipHash.hasOwnProperty(array[i].zipcode)) {
      zipHash[array[i].zipcode].push(array[i]);
      continue;
    }
    zipHash[array[i].zipcode] = [array[i]];
  }
  return zipHash
}

var sortInfoByZip = function(obj) {
  var output = {}
  for(var zip in obj) {
    output[zip] = {
      prices: [],
      bedrooms: []
    };
    for(var i = 0; i < obj[zip].length; i++) {
      for(var key in obj[zip][i]) {
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
            if(!isNaN(obj[zip][i][key])){
              output[zip].prices.push(obj[zip][i][key]);
              output[zip].bedrooms.push(obj[zip][i].bedrooms);
          }
        }
      }
    }    
  }
  return output;
}

var propertiesByZip = sortPropertiesByZip(data);
var propertyInfoByZip = sortInfoByZip(propertiesByZip);

module.exports = propertyInfoByZip;