const mongoose = require("mongoose")
const Schema = mongoose.Schema

const notificationSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    themeId: {
        type: String,
        required: true
    },
    commentLeftBy: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    },
    time: {
        type: String,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model("notifications", notificationSchema)