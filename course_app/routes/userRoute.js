const express = require('express');
const User = require('../db/userModel');
const headerValidation = require('../middleware/headerMiddleware');
const userValidation = require('../middleware/userMiddleware');
const errorObj = require('../util/errorBuilder');
const router = express.Router();


router.post('/signup', userValidation, async function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({username, password});
    newUser.save()
    .then(()=>{
        return res.status(200).json({
            msg : 'User signed up succesfully !',
            user_obj : newUser
        });
    })
    .catch((err)=>{
        console.log(err);
        return next(errorObj.errorBuilder('INTERNAL SERVER ERROR', 500));
    });

});


module.exports = router;

