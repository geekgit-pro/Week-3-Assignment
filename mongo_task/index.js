const express = require('express');
const app = express();
const zod = require('zod');
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

app.post('/admin/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const usernameCheck = zod.string().min(3).max(10);
    const passwordCheck = zod.string().min(3).max(20);

    if (!usernameCheck.safeParse(username).success || !passwordCheck.safeParse(password).success) {
        return res.status(403).json({
            msg: 'Username or password is not valid'
        });
    }
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

app.post('/user/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const usernameCheck = zod.string().min(3).max(10);
    const passwordCheck = zod.string().min(3).max(20);

    if (!usernameCheck.safeParse(username).success || !passwordCheck.safeParse(password).success) {
        return res.status(403).json({
            msg: 'Username or password is not valid'
        });
    }
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

app.post('/admin/courses', async (req, res) => {
    const username = req.headers['username'];
    const password = req.headers['password']

    const admin = await Admin.findOne({username, password});
    if(!admin)
        return res.status(403).json({
            msg : 'Wrong admin credentials'
    })

    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

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

app.post('/user/course/:courseId', async (req, res) => {
    const username = req.headers['username'];
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
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

app.get('/admin/courses', async (req, res) => {
    const username = req.headers['username'];
    const password = req.headers['password']

    const admin = await Admin.findOne({username, password});
    if(!admin)
        return res.status(403).json({
            msg : 'Wrong admin credentials'
    })


    const courses = await Course.find();

    return res.status(200).json({
        courses : courses
    });

});

app.get('/user/courses', async (req, res) => {
    const username = req.headers['username'];
    const password = req.headers['password']

    const user = await User.findOne({username, password});
    if(!user)
        return res.status(403).json({
            msg : 'Wrong admin credentials'
    })


    const courses = await Course.find();

    return res.status(200).json({
        courses : courses
    });

});

app.get('/user/purchasedCourses', async (req, res) => {
    const username = req.headers['username'];
    const password = req.headers['password']

    const user = await User.findOne({username, password});
    if(!user)
        return res.status(403).json({
            msg : 'Wrong admin credentials'
    })

    res.status(200).json({
    purchasedCourses: user.purchasedCourses
    });

});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
