const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema ({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: true,
        default: "https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_1280.png"
    },
    comments: Array,
    notifications: Array
})

module.exports = mongoose.model("Users", userSchema)