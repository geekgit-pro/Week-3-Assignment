const express = require('express');
const Admin = require('../db/adminModel');
const Course = require('../db/courseModel');
const adminValidation = require('../middleware/adminMiddleware');
const router = express.Router();



router.use(express.json());
router.use(express.urlencoded({extended: true}));


router.post('/signup', adminValidation, async function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const newAdmin = new Admin({username, password});
    newAdmin.save()
    .then(()=>{
        return res.status(200).json({
            msg : 'Admin signed up succesfully !',
            admin_obj : newAdmin,
        })
    })
    .catch((err)=>{
        console.log(err);
        return res.status(500).json({
            message : err.message,
            code : err.status
        });
    });

});


router.post('/courses', async function (req,res,next) {
    const username = req.headers['username'];
    const password = req.headers['password'];

    const admin = await Admin.findOne({username : username});

    if(!admin) {
        return res.status(400).json({
            message : 'Admin details is not correct'
        });
    }

    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    const newCourse = new Course({
        title,
        description,
        price,
        imageLink
    });
    newCourse.save()
    .then(()=>{
        return res.status(200).json({
            message : `${username} created course successfully`,
            courseId : newCourse._id
        });
    })
    .catch((err)=>{
        return res.status(500).json({
            message : err.message,
            code : err.status
        })
    });
});


router.get('/courses', async function (req, res, next) {
    const username = req.headers['username'];
    const password = req.headers['password'];

    const admin = await Admin.findOne({username : username});

    if(!admin) {
        return res.status(400).json({
            message : 'Admin details is not correct'
        });
    }

    const courses = await Course.find();

    return res.status(200).json({
        courses : courses
    });

});


module.exports = router;


