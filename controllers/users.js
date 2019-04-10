let User = require('../models/user');
let Product = require('../models/product');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: "Email not found"
            });
        }
        if(req.body.password == user[0].password) {
            jwt.sign({user:user[0]}, 'secretkey', (err, token) => {
                return res.status(200).json({
                    message: "You are logged in successfully",
                    token: token
                });
            });
        }
        else {
            return res.json({
                message: "Wrong password"
            });
        }
    })
    .catch(err => {
        res.json({
          error: err
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
            return res.json({
                user,
                product
            });
        })
        .catch(err => {
            res.json({
            error: err
            });
        });
    })
    .catch(err => {
        res.json({
          error: err
        });
    });
};

module.exports = {
    login,
    addProductToCart
};