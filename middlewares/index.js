const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'secretkey', (err, authData) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            } else {
                authData
                next();
            }
        });
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};

module.exports = {
    verifyUser
};