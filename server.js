const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = '81d639332326c0097fdc8ca6fbcdd60f';
// console.log(apiKey.key);

const accountSid = 'AC5e4b48dbd5d0885a1b5a35146861a235'; 
const authToken = '247af21c7bbc0775980e8040726914dc'; 
const client = require('twilio')(accountSid, authToken); 
 


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let phone = req.body.phone;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  var  number='whatsapp:+91' + phone;
  console.log(number);
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        
        let weatherTextExpanded = `It's ${weather.main.temp} degrees, with
          ${weather.main.humidity}% humidity in ${weather.name}!`;
          client.messages 
          .create({ 
             body: weatherTextExpanded, 
             from: 'whatsapp:+14155238886',       
             to: number 
           }) 
          .then(message => console.log(message.sid)) 
          .done();
        res.render('index', {weather: weatherTextExpanded, error: null});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
