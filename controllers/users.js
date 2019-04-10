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
const addProductToCart = async (req, res) => {
    let arrayOfProducts = req.body;
    cartProductsQuantity = 0;
    cartProductsAvalibale = 0;
    try {
        try {
            userDate = await User.findOne({ _id: req.params.id }).exec();
        } catch (error) {
            res.json({
                error: 1,
                message: "This user cannot be found"
            });
            throw error;
        }
        if(arrayOfProducts === undefined || arrayOfProducts.length == 0) {
            res.json({
                error: 1,
                message: "Nothing to add"
            });
        } else {
            for (const item of arrayOfProducts) {
                try {
                    productData = await Product.findById(item.id);

                } catch (error) {
                    res.json({
                        error: 1,
                        message: "Product cannot be found"
                    });
                    throw error;
                }
                if (productData.quantity >= item.quantity) {
                    User.findByIdAndUpdate(userDate._id, 
                    {$push: {cart: {"product": productData._id, "quantity": item.quantity}}})
                    .catch(err => {
                        throw err;
                    });
                    cartProductsQuantity+=1;
                }
            }
            if(cartProductsQuantity!=0) {
                res.json({
                    error: 0,
                    message: "Your cart has been updated uccessfully"
                });
            } else {
                res.json({
                    error: 0,
                    message: "The quantity specified greater than the quantity you selected"
                });
            }
        }
    } catch (error) {
        res.json({
            error: 1,
            message: error
        });
        throw error;
    }
}

module.exports = {
    login,
    addProductToCart
};