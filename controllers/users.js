let User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    //Only for test
    /*getAllUsers : (req, res) => {
        User.find({}, function(err, users){
            if(err) {
                console.log(err);
            } else {
                res.send( users);
            }
        });
    },*/
    
    login : (req, res, next) => {
        User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            jwt.sign({user:user[0]}, 'secretkey', (err, token) => {
                return res.status(200).json({
                    message: "Auth successful",
                    token: token
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
        });
    }
};