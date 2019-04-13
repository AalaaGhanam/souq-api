const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const { login, addProductToCart, checkOut, success } = require('../controllers/users');
const { verifyUser } = require('../middlewares/index');

router.use(bodyParser.json());

//api/user/login
router.route('/login')
    .post(login)

//api/user/addProductToCart:id
router.route('/addProductToCart/:id')
    .post(addProductToCart, verifyUser)

//api/user/getAllProducts
router.route('/checkOut')
    .get(verifyUser, checkOut);

//api/user/success
router.route('/success')
    .post(success);

module.exports = router;