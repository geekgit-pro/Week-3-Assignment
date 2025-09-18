const express = require('express');
const app = express();
const zod = require('zod');
const { ZodError } = require('zod');
const mongoose = require('mongoose');

const port = 3008;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://geeksen7_admin:geeksen7admin@cluster0.hsykzlb.mongodb.net/course_app');

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});
const Admin = mongoose.model('Admins', adminSchema);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    title: String,
    price: Number,  
}]
});
const User = mongoose.model('Users', userSchema);

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: { type: Boolean, default: true }

});
const Course = mongoose.model('Courses', courseSchema);

function errorBuilder(message, status = 500, details = null) {
    const err = new Error(message);
    err.status = status;
    if (details) err.details = details; // support extra info if needed
    console.log(err);
    return err;
}

function zodMiddleware(req, res, next) {

    const credentialSchema = zod.object({
        username : zod.string().
                            min(3,"Username must be 3 characters long")
                            .max(10,"Username can't blonger that 10 characters"),
        password : zod.string().
                            min(3,"Password must be 3 characters long")
                            .max(10," can't blonger that 10 characters")
    });
    try {
        credentialSchema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            const errors = err.issues.map(issue => ({
                message: issue.message,
                field: issue.path[0],
            }));

            console.error("Validation failed and here is the array:", errors);
            err.status = 400;
            err.details = errors;

            return next(errorBuilder('Username of password validation failed', 400, errors));
        }
        console.error("Unexpected error in middleware:", err);

        err.status = 500;
        return next(err);
    }
}

app.post('/admin/signup',zodMiddleware, (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const newAdmin = new Admin({ username, password });
    newAdmin.save()
        .then(() => {
            res.status(200).json({
                msg: 'Admin signed up successfully'
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                msg: 'Internal server error'
            });
        });
});

app.post('/user/signup', zodMiddleware, (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const newUser = new User({ username, password });
    newUser.save()
        .then(() => {
            res.status(200).json({
                msg: 'User signed up successfully'
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                msg: 'Internal server error'
            });
        });
});

app.post('/admin/courses', async (req, res, next) => {
    const username = req.headers['username'];
    const password = req.headers['password']

    const admin = await Admin.findOne({username, password});

    if(!admin) {
        return next(errorBuilder('Wrong admin credentials', 403));
    }

    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    if(!title || !description || !price || !imageLink) {
        return next(errorBuilder('Please input proper detail for course', 401));
    }

    const newCourse = new Course({ title, description, price, imageLink });
    newCourse.save()
        .then(() => {
            res.status(200).json({
                msg: 'Course created successfully',
                courseId: newCourse._id
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                msg: 'Internal server error'
            });
        });
});

app.post('/user/course/:courseId', async (req, res, next) => {
    const username = req.headers['username'];
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if(!course) {
        return next(errorBuilder('Course meant to purchase does not exist',401));
    }
    await User.findOneAndUpdate({username},{
        "$push": {
              purchasedCourses: {
                    courseId: course._id,
                    title: course.title,
                    price: course.price
                }
        }
    });

    return res.status(200).json({
        msg : `User ${username} purchased ${courseId}`,
    })

});

app.get('/admin/courses', async (req, res, next) => {
    const username = req.headers['username'];
    const password = req.headers['password']

    const admin = await Admin.findOne({username, password});
    if(!admin) {
        return next(errorBuilder('The admin credentials are wrong or admin does not exist'),401);
    }
    
    const courses = await Course.find();

    return res.status(200).json({
        courses : courses
    });

});

app.post('/user/courses', async (req, res, next) => {
    const username = req.headers['username'];
    const password = req.headers['password']

    const user = await User.findOne({username, password});
    if(!user) {
        return next(errorBuilder('The user credentials are wrong or user does not exist'),401);
    }

    const courses = await Course.find();

    return res.status(200).json({
        courses : courses
    });

});

app.get('/user/purchasedCourses', async (req, res, next) => {
    const username = req.headers['username'];
    const password = req.headers['password']

    const user = await User.findOne({username, password});
    if(!user) {
        return next(errorBuilder('The user credentials are wrong or user does not exist'),401);
    }

    res.status(200).json({
    purchasedCourses: user.purchasedCourses
    });

});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
            error: {
                message: err.message || 'Internal Server Error',
                status: err.status || 500,
                details: err.details || null      
            }
    })
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
