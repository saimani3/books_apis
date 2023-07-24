var mongoose = require('mongoose');

const booksschema = new mongoose.Schema({
    title:{
        type:String,
    },
    author:{
        type:String,
    },
    description:{
        type:String,
    },
    publication_year:{
        type:Number,
    },
})


module.exports = mongoose.model('books',booksschema)