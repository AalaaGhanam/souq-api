let Product = require('../models/product');

const getAllProducts = (req, res) => {
    Product.find({}, function(err, products){
        if(err) {
            res.send(err);
        } else {
            res.send(products);
        }
    });
};

module.exports = {
    getAllProducts
};