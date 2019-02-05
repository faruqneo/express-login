const mongoose = require('mongoose')

let LoginSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    phone:{
        type: Number,
        require: true
    },
    password:{
        type: String,
        require: true
    }

});

let Login = module.exports = mongoose.model('Login' ,LoginSchema ,'login');