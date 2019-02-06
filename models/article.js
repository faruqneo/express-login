const mongoose = require('mongoose')

let ArticleSchema = mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    author:{
        type: String,
        require: true
    },
    body:{
        type: String,
        require: true
    }
});

let Article = module.exports = mongoose.model('Articles', ArticleSchema)