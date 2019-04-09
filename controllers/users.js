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
    
    login : (req, res) => {
        User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Email not found"
                });
            }
            if(req.body.password == user[0].password) {
                jwt.sign({user:user[0]}, 'secretkey', (err, token) => {
                    return res.status(200).json({
                        message: "You are logged in successfully",
                        token: token
                    });
                });
            }
            else {
                return res.json({
                    message: "Wrong password"
                });
            }
        })
        .catch(err => {
            res.json({
              error: err
            });
        });
    }
};