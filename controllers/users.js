let User = require('../models/user');
let Product = require('../models/product');
const jwt = require('jsonwebtoken');
const fx = require('money');
const lodash = require('lodash');

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
                        let picked = lodash.filter(userData.cart, { 'product': productData._id } );
                        if(picked.length > 0) {
                            productNotFoundArray.push('Product '+productData.name+' already exist');
                        } else {
                            User.findByIdAndUpdate(userData._id, 
                            {$push: {cart: {"product": productData._id, "quantity": product.quantity}}}).exec();
                            cartProductsQuantity+=1;
                        }
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

const checkOut = async(req, res) => {
    const user = req.authData.user;
    User.findById(user._id,  async(error, userData) => {
        if (error || !userData) {
            res.json({
                error: 1,
                message: "This user cannot be found"
            });
            return
        }
        productsTotalPrice = 0;
        totalProducts = 0;
        totalPrice = 0;
        if(userData.cart === undefined || userData.cart.length == 0) {
            res.json({
                error: 1,
                message: "Cart is empty"
            });
            return
        } else {
            let productNotFoundArray = [];
            for( const product of userData.cart){
                productData = await Product.findById(product.product);
                if (productData) {
                    if (productData.quantity >= product.quantity) {
                        let newPrice = 0;
                        if (productData.currency!='USD') {
                            fx.rates = {
                                'EUR' : 0.88, 
                                'GBP' : 0.647710,
                                'HKD' : 7.781919,
                                'EGP' : 17.29,
                                'USD' : 1,  
                            }
                            let converted = fx.convert(productData.price, {from: productData.currency, to: 'USD'});
                            productData.currency = 'USD';
                            newPrice = converted.toFixed(2);

                        } else {
                            newPrice = productData.price;
                        }
                        totalProducts+=1;
                        totalPrice+=newPrice*product.quantity;
                    } else {
                        productNotFoundArray.push('The quantity you selected greater than the quantity of product '+ productData.name);
                    }
                } else {
                    productNotFoundArray.push('product '+ product.product+ ' cannot be found')
                }
            }
            if(totalProducts > 0) {
                if( totalProducts < userData.cart.length) {
                    res.json({
                        error: 1,
                        message: productNotFoundArray
                    });
                } else {
                    const sid = 901405851;
                    let link = 'https://sandbox.2checkout.com/checkout/purchase?sid='+sid+'&mode=2CO&userId='+user._id+'&li_0_price='+totalPrice;
                    res.json({
                        error: 0,
                        message: link
                    });
                }
            } else {
                res.json({
                    error: 1,
                    message: productNotFoundArray
                });
            }
        }
    });
}

const success = (req, res) => {
    User.findById(req.body.userid,  async(error, userData) => {
        if (error || !userData) {
            res.json({
                error: 1,
                message: "This user cannot be found"
            });
            return
        }
        for(const product of userData.cart) {
            const productData = await Product.findById(product.product);
            if(productData) {
                if(productData.quantity < product.quantity) {
                    Product.findByIdAndUpdate(productData._id, {quantity: 0}).exec();
                } else {
                    let diff = productData.quantity - product.quantity;
                    Product.findByIdAndUpdate(productData._id, {quantity: diff}).exec();
                }
            }
        }
        User.findByIdAndUpdate(userData._id, { $set: { cart: [] }}).exec();;
    });
    res.json({
        error: 0,
        message: 'Congratulations, payment Successfully Completed'
    });
}

module.exports = {
    login,
    addProductToCart,
    checkOut,
    success
};