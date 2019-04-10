const express = require("express");
const router = express.Router();
const { getAllProducts } = require('../controllers/products');
const { verifyUser } = require('../middlewares/index');

//api/products/getAllProducts
router.route('/getAllProducts')
    .get(verifyUser, getAllProducts);

module.exports = router;