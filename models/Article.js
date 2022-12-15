const {Schema, model} = require('mongoose');

const ArticleSchema = Schema({
    titulo: {
        type: String,
        require: true
    },
    contenido: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: "default.png"
    }
})

module.exports = model("Article", ArticleSchema, "articles")