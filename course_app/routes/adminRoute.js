const express = require('express');
const Admin = require('../db/adminModel');
const Course = require('../db/courseModel');
const adminValidation = require('../middleware/adminMiddleware');
const headerValidation = require('../middleware/headerMiddleware');
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


router.post('/courses', headerValidation, async function (req,res,next) {

    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    if(!title || !description || !price || !imageLink) {
        return next(errorObj.errorBuilder('Please input the required details of course',400));
    }


    const newCourse = new Course({
        title,
        description,
        price,
        imageLink,
        creator : req.headers['username']
    });
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

    const courses = await Course.find({creator : req.headers['username']});

    return res.status(200).json({
        courses : courses
    });

});

router.use(errorObj.errorBuilder);


module.exports = router;


