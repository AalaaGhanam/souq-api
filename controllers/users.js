let User = require('../models/user');
let Product = require('../models/product');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                error: 1,
                message: "Email not found"
            });
        }
        if(req.body.password == user[0].password) {
            jwt.sign({user:user[0]}, 'secretkey', (err, token) => {
                return res.status(200).json({
                    error: 0,
                    message: "You are logged in successfully",
                    token: token
                });
            });
        }
        else {
            return res.json({
                error: 1,
                message: "Wrong password"
            });
        }
    })
    .catch(err => {
        res.json({
            error: 1,
            message: err
        });
    });
};

const addProductToCart = (req, res) => {
    User.findOne({ _id: req.params.id })
    .exec()
    .then(user => {
        Product.findOne({ _id: req.body.id })
        .exec()
        .then(product => {
            User.findByIdAndUpdate(user._id, 
                {$push: {cart: {"product": product._id, "quantity": req.body.quantity}}}, 
                function(err) { 
                    if(err) {
                        res.send({
                            error: 1,
                            message: err
                        });
                    }
                    res.json({
                        error: 0,
                        message: "Your cart has been updated uccessfully"
                    });
                });
        })
        .catch(err => {
            res.json({
                error: 1,
                message: "This product cannot be found"
            });
        });
    })
    .catch(err => {
        res.json({
            error: 1,
            message: "This User cannot be found"
        });
    });
};

module.exports = {
    login,
    addProductToCart
};