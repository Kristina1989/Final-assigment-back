const mongoose = require("mongoose")
const Schema = mongoose.Schema

const themesSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String
    },
    comments: Array,
})

module.exports = mongoose.model("Themes", themesSchema)