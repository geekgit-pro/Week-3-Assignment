const express = require('express');
const mongoose = require('mongoose');
const { boolean } = require('zod');


mongoose.connect('mongodb+srv://geeksen7_admin:geeksen7admin@cluster0.hsykzlb.mongodb.net/app_course');

const userSchema = new mongoose.Schema({
    username : String,
    password : String,
    purchasedCourse :[{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
    }]
   
});

const userModel = mongoose.model('Users', userSchema);


module.exports = userModel;
