const errorObj = require('../util/errorBuilder');
function headerValidation(req, res, next) {
    const username = req.headers['username'];
    const password = req.headers['password'];

    if(!username || !password) {
        return next(errorObj.errorBuilder('Username of password missing in headers'), 400);
    }

    return next();
}

module.exports = headerValidation;