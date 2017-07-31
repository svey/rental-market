# Rental Market

A simple API for POSTing property info and receiving rental information regarding price, booking rate, and earnings. The rental-market uses dummy data and linear regression to model the relationship between rental price and rooms across properties in the same zip code.

## To use:
1. From the Repo's local directory on your machine in Terminal or CommandPrompt run:
    + npm install  
    + npm start  
2. The API can be easily tested using Postman https://www.getpostman.com/  
    Note: Postman request should be made with urlencoded or raw JSON

## Endpoints at http://localhost:3000/api
+ ### /price  
  #### Parameters:
    + zipcode (94158)
    + bedroom_count (2)
+ ### /booking_rate  
    #### Parameters:
    + zipcode (94158)
    + bedroom_count (2)
+ ### /earnings  
    #### Parameters:
    + zipcode (94158)
    + bedroom_count (2)
    + start_date (2015-01-01)
    + end_date (2015-07-01)
    
## Built with:
+ Node.JS/Express.JS
