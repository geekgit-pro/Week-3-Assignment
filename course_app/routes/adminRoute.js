const express = require('express');
const Admin = require('../db/adminModel');
const Course = require('../db/courseModel');
const adminValidation = require('../middleware/adminMiddleware');
const headerValidation = require('../middleware/headerMiddleware');
const courseInputValidation = require('../middleware/courseMiddleware');
const errorObj = require('../util/errorBuilder');
const router = express.Router();


router.post('/signup', adminValidation, async function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const newAdmin = new Admin({username, password});
    newAdmin.save()
    .then(()=>{
        return res.status(200).json({
            msg : 'Admin signed up succesfully !',
            admin_obj : newAdmin,
        });
    })
    .catch((err)=>{
        console.log(err);
        return next(errorObj.errorBuilder('INTERNAL SERVER ERROR', 500));
    });

});


router.post('/courses', headerValidation, courseInputValidation, async function (req,res,next) {
    let newCourse = new Course(req.body);
    newCourse.creator = req.header['username'];
    newCourse.save()
    .then(()=>{
        return res.status(200).json({
            message : `${req.headers['username']} created course successfully`,
            courseId : newCourse._id
        });
    })
    .catch((err)=>{
        console.log("hello brother");
        return next(errorObj.errorBuilder('INTERNAL SERVER ERROR',500));
    });
});


router.get('/courses', headerValidation, async function (req, res, next) {

    const courses = await Course.find({creator : req.headers['username']}, { creator: 0 } );

    return res.status(200).json({
        courses : courses
    });

});

router.use(errorObj.errorBuilder);


module.exports = router;


