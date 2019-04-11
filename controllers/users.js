let User = require('../models/user');
let Product = require('../models/product');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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
const addProductToCart =  (req, res) => {
    let arrayOfProducts = req.body;
    let cartProductsQuantity = 0;
    User.findById(req.params.id,  async(error, userData) => {
        if (error || !userData) {
            res.json({
                error: 1,
                message: "This user cannot be found"
            });
            return
        }
        if(arrayOfProducts === undefined || arrayOfProducts.length == 0) {
            res.json({
                error: 1,
                message: "Nothing to add"
            });
            return
        }
        for (const product of arrayOfProducts) {
            try {
                productData = await Product.findById(product.id);
            } catch (error) {
                res.json({
                    error: 1,
                    message: "Product cannot be found"
                });
                throw Error(error);
            }
            if (productData.quantity >= product.quantity) {
                User.findByIdAndUpdate(userData._id, 
                {$push: {cart: {"product": productData._id, "quantity": product.quantity}}})
                .catch(err => {
                    throw Error(err);
                });
                cartProductsQuantity+=1;
            }
        }
        if(cartProductsQuantity>0) {
            res.json({
                error: 0,
                message: "Your cart has been updated uccessfully"
            });
        } else {
            res.json({
                error: 1,
                message: "The quantity specified greater than the quantity you selected"
            });
        }  
    })
}

module.exports = {
    login,
    addProductToCart
};