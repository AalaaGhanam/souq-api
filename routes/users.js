const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const { login } = require('../controllers/users');

router.use(bodyParser.json());

router.route('/login')
    .post(login)

module.exports = router;