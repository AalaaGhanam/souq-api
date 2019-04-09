const express = require("express");
const router = express.Router();
const ProductsController = require('../controllers/products');

router.route('/')
    .get(ProductsController.getAllProducts);

module.exports = router;