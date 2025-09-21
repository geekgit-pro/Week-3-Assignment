
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://geeksen7_admin:geeksen7admin@cluster0.hsykzlb.mongodb.net/app_course');

const courseSchema = new mongoose.Schema({
    title : String,
    description : String,
    price : Number,
    imageLink : String,
    published : {
        type : Boolean,
        default : true
    },
    creator : String
});

const courseModel = mongoose.model('Courses', courseSchema);

module.exports = courseModel;
