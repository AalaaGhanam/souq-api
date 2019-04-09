let Product = require('../models/product');

module.exports = {
    getAllProducts : (req, res) => {
        Product.find({}, function(err, products){
            if(err) {
                console.log(err);
            } else {
                res.send( products);
            }
        });
    }
};