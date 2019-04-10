const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const { login } = require('../controllers/users');

router.use(bodyParser.json());

//api/user/login
router.route('/login')
    .post(login)

module.exports = router;