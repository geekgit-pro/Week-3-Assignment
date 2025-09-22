const errorObj = require('../util/errorBuilder');
const Admin = require('../db/adminModel');
const Course = require('../db/courseModel');
const User = require('../db/userModel');
async function headerValidation(req, res, next) {
    const username = req.headers['username'];
    const password = req.headers['password'];

    if(!username || !password) {
        return next(errorObj.errorBuilder('Username of password missing in headers', 400));
    }

    if(req.originalUrl.startsWith('/admin')) {
        const admin = await Admin.findOne({username : username});

        if(!admin) {
            return next(errorObj.errorBuilder('Admin details is not correct', 400));
    }
    }

    if(req.originalUrl.startsWith('/user')) {
        const user = await User.findOne({username : username});

        if(!user) {
            return next(errorObj.errorBuilder('Admin details is not correct', 400));
    }
    }

    return next();
}

module.exports = headerValidation;