
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://geeksen7_admin:geeksen7admin@cluster0.hsykzlb.mongodb.net/app_course');

const adminSchema = new mongoose.Schema({
    username : String,
    password : String
});

const adminModel = mongoose.model('Admins', adminSchema);


module.exports = adminModel;
