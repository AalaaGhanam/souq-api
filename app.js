const express = require("express");
const path = require("path");

//Init app
const app = express();

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')


//Home route
app.get('/', function(req, res){
    let products= [{
        "name": "P50",
        "price": 2000,
        "currency": "USD",
        "cateogiry": "electornics",
        "vendor": "lenovo",
        "publisher": "compume",
        "quantity": 10,
        "description": "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias"
    },
    {
        "name": "iPhone XS Max",
        "price": 17000,
        "currency": "EGP",
        "cateogiry": "phones",
        "vendor": "apple",
        "publisher": "tradeline",
        "quantity": 33,
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
    },
    {
        "name": "Revenger-X",
        "price": 40,
        "currency": "EUR",
        "cateogiry": "electornics",
        "vendor": "vaporesso",
        "publisher": "hub life",
        "quantity": 3,
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
    },
    {
        "name": "Reclining Sofa",
        "price": 1139,
        "currency": "USD",
        "cateogiry": "furniture",
        "vendor": "La-Z-Boy",
        "publisher": "jumia",
        "quantity": 12,
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
    }
];
    res.send( products);
});

//Add all products
app.get('/addAllProducts', function(req, res){
    res.send("sssssssss");
});

//Start server
app.listen(3000, function(){
    console.log("Server started on port 3000....");
});

console.log("jjjjjjjjjjjjjjjjj");
