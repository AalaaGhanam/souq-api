const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const products = require('./routes/products');
const users = require('./routes/users');
const bodyParser = require('body-parser');

//mongodb connection
mongoose.connect('mongodb://localhost/souqdb');
let db = mongoose.connection;

//Check connection
db.once('open', function(){
    console.log('Connected to mongodb'); 
});

//Check for db errors
db.on('error', function(err){
    console.log(err);
});

//Init app
const app = express();

//Start server
app.listen(3000, function(){
    console.log("Server started on port 3000....");
});

//Routes
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/user', users);

//console.log("jjjjjjjjjjjjjjjjj");