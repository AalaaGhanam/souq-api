const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const { login, addProductToCart } = require('../controllers/users');
const { verifyUser } = require('../middlewares/index');

router.use(bodyParser.json());

//api/user/login
router.route('/login')
    .post(login)

//api/user/addProductToCart:id
router.route('/addProductToCart/:id')
    .post(addProductToCart, verifyUser)

module.exports = router;