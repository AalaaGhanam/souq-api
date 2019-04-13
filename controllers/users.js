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
        let productNotFoundArray = [];
        for (const product of arrayOfProducts) {
            productData = await Product.findById(product.id);
                if (productData) {
                    if (productData.quantity >= product.quantity) {
                        User.findByIdAndUpdate(userData._id, 
                        {$push: {cart: {"product": productData._id, "quantity": product.quantity}}}).exec();
                        cartProductsQuantity+=1;
                    } else {
                        productNotFoundArray.push('The quantity you selected greater than the quantity of product '+ productData.name);
                    }
                } else {
                    productNotFoundArray.push('product '+ product.product+ ' cannot be found')
                }
        }
        if(cartProductsQuantity>0) {
            if(productNotFoundArray.length<=0) {
                res.json({
                    error: 0,
                    message: "Your cart has been updated uccessfully"
                });
            } else {
                res.json({
                    error: 0,
                    message: "Your cart has been updated uccessfully",
                    exceptions: productNotFoundArray,
                });
            }
        } else {
            res.json({
                error: 1,
                message: productNotFoundArray
            });
        }  
    })
}

module.exports = {
    login,
    addProductToCart
};