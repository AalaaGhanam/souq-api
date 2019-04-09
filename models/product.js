let mongoose = require("mongoose");

//Schema
let productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    cateogiry: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

let Product = module.exports = mongoose.model('Product', productSchema);