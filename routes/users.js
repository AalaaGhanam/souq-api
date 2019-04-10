const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const { test, login } = require('../controllers/users');

router.use(bodyParser.json());

router.route('/login')
    .post(login)
    
router.route('/test')
    .post(test)

module.exports = router;