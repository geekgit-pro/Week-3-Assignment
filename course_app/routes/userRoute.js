const express = require('express');
const User = require('../db/userModel');
const Course = require('../db/courseModel');
const headerValidation = require('../middleware/headerMiddleware');
const userValidation = require('../middleware/userMiddleware');
const errorObj = require('../util/errorBuilder');
const { route } = require('./adminRoute');
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

router.get('/courses', headerValidation, async function (req, res, next) {
    try {
        const courses = await Course.find();
        return res.status(200).json({
        courses : courses
    });
    } catch (error) {
        console.log(error);
        return next(errorObj.errorBuilder('INTERNAL SERVER ERROR'),500);
    }
});

router.post('/courses/:courseId', headerValidation, async function (req, res, next) {
    const username = req.headers['username'];
    const courseId = req.params.courseId;
    
    try {
        const course = await Course.findById(courseId);
        if(!course) {
            return next(errorObj.errorBuilder('Course not found',401));
        }

       const updatedUser = await User.findOneAndUpdate(
                                            { username },
                                            { "$push" : { purchasedCourse: course._id } },
                                            { new: true }
                                    );
        console.log(updatedUser);

        if (!updatedUser) {
            return next(errorObj.errorBuilder('User not found', 401));
        }

        return res.status(200).json({
        message : `${username} purchased ${course}`
    });
 
    } catch (error) {
        return next(errorObj.errorBuilder('INTERNAL SERVER ERROR',500));
    }
});

// router.get('/purchasedCourse', headerValidation, async function (req, res, next) {
//     const username = req.headers['username'];

//     try {
//         const user = await User.findOne({ username }).populate('purchasedCourses.courseId');

//         if (!user) {
//             return next(errorObj.errorBuilder('User not found', 404));
//         }
//         const purchasedCourses = user.purchasedCourse.map(pc => pc.courseId);

//         return res.status(200).json({
//             username: user.username,
//             purchasedCourses
//         });

//     } catch (error) {
//         console.error(error);
//         return next(errorObj.errorBuilder('INTERNAL SERVER ERROR', 500));
//     }
// })


module.exports = router;

