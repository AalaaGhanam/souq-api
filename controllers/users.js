let User = require('../models/user');
let Product = require('../models/product');
const jwt = require('jsonwebtoken');
const fx = require('money');

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

const checkOut = async(req, res) => {
    const user = req.authData.user;
    const sellerId = 901405851;
    let link = 'https://sandbox.2checkout.com/checkout/purchase?sid='+sellerId+'&';
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
        if(userData.cart === undefined || userData.cart.length == 0) {
            res.json({
                error: 1,
                message: "Cart is empty"
            });
            return
        } else {
            let params = 'mode=2CO&userId='+user._id+'&';
            let productNotFoundArray = [];
            for( const [index, product] of (userData.cart).entries()){
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
                        params += 'li_'+index+'_product_id'+productData._id+'li_'+index+'_name='+productData.name+'&li_'+index+'_price='+newPrice+'&li_'+index+'_quantity='+product.quantity+'&';
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
                    link += params;
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
            if(productData.quantity < product.quantity) {
                Product.findByIdAndUpdate(productData._id, {quantity: 0}, (err,result)=> {
                    if(!err){
                        result.save();
                    }
                });
            } else {
                let diff = productData.quantity - product.quantity;
                Product.findByIdAndUpdate(productData._id, {quantity: diff}, (err,result)=> {
            if(!err){
                result.save();
            }
        });
            }
        }
        User.findByIdAndUpdate(userData._id, { $set: { cart: [] }}, (err,result)=> {
            if(!err){
                result.save();
            }
        });
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