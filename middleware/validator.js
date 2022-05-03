const emailValidator = require("email-validator")
const userSchema = require('../schemas/userSchema')


module.exports = {
    regValidator: async (req, res, next) => {
        const {email, username, password, passwordTwo} = req.body

        const findEmail = await userSchema.findOne({email})
        const findUsername = await userSchema.findOne({username})

        if (findEmail) return res.send({success: false, message: 'Email in use'})
        if (findUsername) return res.send({success: false, message: 'Username in use'})

        if (!emailValidator.validate(email)) return res.send({success: false, message: 'Check email please'})
        if (username.length < 4) return res.send({success: false, message: 'Username is too short'})
        if (username.length > 20) return res.send({success: false, message: 'Username is too long'})
        if (4 > password.length) return res.send({success: false, message: 'Password too short'})
        if (password !== passwordTwo) return res.send({success: false, message: 'Passwords don`t match'})

        next()
    },
    loginValidator: (req, res, next) => {
        const {username, password} = req.body
        if (username.length === 0) return res.send({success: false, message: 'Enter username'})
        if (password.length === 0) return res.send({success: false, message: 'Enter password'})

        next()
    },
    userLoggedInValidation: (req, res, next) => {
        const {username} = req.session

        if (!username) return res.send({success: false, message: "User not logged in"})

        next()
    },
    uploadThemeValidator: (req, res, next) => {
        const {title, comment} = req.body

        if (title.length < 4) return res.send({success: false, message: 'Title has to be at least 4 symbols long'})
        if (comment.length < 10) return res.send({success: false, message: 'Comment has to be at least 10 symbols long'})

        next()
    }
}