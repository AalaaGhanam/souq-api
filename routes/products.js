const express = require("express");
const router = express.Router();
const ProductsController = require('../controllers/products');
const userAuth = require('../middlewares/index');

router.route('/')
    .get(userAuth.verifyUser, ProductsController.getAllProducts);

module.exports = router;