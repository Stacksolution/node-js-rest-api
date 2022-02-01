const express = require('express');
const bodyParser = require('body-parser');
// set up our express app
const app = express();



// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// connect to mongodb
const dbConfig = require('./app/config/database.config.js');
const mongoose = require('mongoose');
console.log(dbConfig.url.toString());
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
app.use(express.static('public'));

// initialize routes
app.use('/api', require('./app/routes/api'));

// error handling middleware
app.use(function (err, req, res, next) {
    //console.log(err);
    res.status(422).send({ status: false, message: req });
});

// listen for requests
app.listen(process.env.PORT || 5000, function () {
    console.log('Ready to Go !' + process.env.PORT);
});