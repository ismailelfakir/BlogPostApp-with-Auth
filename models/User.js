//require mongoose, passport-loccal-mongoose
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


//create user schema 
const userSchema = new mongoose.Schema({
    username: String,
    email: String,  
    password: String,
    userImage: String 
})

//hash password using passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

//export userModel with userSchema
module.exports = mongoose.model('userModel', userSchema);

