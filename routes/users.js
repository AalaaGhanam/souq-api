const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const UsersController = require('../controllers/users');

router.use(bodyParser.json());

router.route('/login')
    .post(UsersController.login)

module.exports = router;