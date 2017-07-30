# Rental Market

A simple API for POSTing property info and recieving rental information regarding price, booking rate, and earnings.

## To use:
1. Fork the Repo to your personal GitHub
2. Clone/ or download to your computer
3. From the Repo's local directory on your machine in Terminal or CommandPrompt run:
    + npm install  
    + npm start  
4. The API can be easily tested using Postman https://www.getpostman.com/

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
