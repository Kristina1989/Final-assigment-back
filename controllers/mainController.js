const userSchema = require('../schemas/userSchema')
const themesSchema = require('../schemas/themesSchema')
const notificationSchema = require('../schemas/notificationSchema')
const bcrypt = require("bcrypt")

module.exports = {
    loggedIn: async (req, res) => {
        const {username, checked} = req.session
        if (checked) {
            const findUser = await userSchema.findOne({username})
            const user = {
                username,
                userImage: findUser.userImage,
                themes: findUser.themes,
                notifications: findUser.notifications,
            }
            return res.send({success: true, user})
        }
        res.send({success: false})
    },
    register: async (req, res) => {
        const {email, username, password} = req.body
        const hash = await bcrypt.hash(password, 10)
        const user = await new userSchema({
            email,
            username,
            password: hash
        })
        await user.save()

        res.send({success: true})
    },
    login: async (req, res) => {
        const {username, password, checked} = req.body
        const findUser = await userSchema.findOne({username})
        if (findUser) {
            const compareResult = await bcrypt.compare(password, findUser.password)
            if (compareResult) {
                req.session.username = username
                req.session.checked = checked
                const user = {
                    username,
                    userImage: findUser.userImage,
                    themes: findUser.themes,
                    notifications: findUser.notifications
                }
                return res.send({success: true, user})
            }
        }
        res.send({success: false, message: 'Bad credentials'})
    },
    logout: async (req, res) => {
        req.session.email = null
        req.session.checked = null
        res.send({success: true})
    },
    uploadTheme: async (req, res) => {
        const {title, comment, username, photoUrl} = req.body

        const findUser = await userSchema.findOne({username})
        if (findUser) {
            const theme = new themesSchema({
                username,
                title,
                comment,
                photoUrl,
                time: Date.now()
            })
            await theme.save()
            return res.send({success: true, message: "Upload was successful"})
        }
        res.send({success: false, message: "Something went wrong"})
    },
    getTopics: async (req, res) => {
        const topics = await themesSchema.find({})
        res.send({success: true, topics})
    },
    getTheme: async (req, res) => {
        const {_id} = req.params
        const {username} = req.session

        const findTheme = await themesSchema.findOne({_id})

        if (findTheme.username === username) await notificationSchema.updateMany({topicId: _id}, {
                $set:
                    {read: true}
            },
            {new: true})

        // if (findTheme.username === username) await userSchema.findOneAndUpdate({username}, {
        //         $pull: {
        //             notifications:
        //                 {topicId: _id}
        //         }
        //     },
        //     {new: true})
        if (findTheme) return res.send({success: true, theme: findTheme})

        res.send({success: false, message: "Something went wrong"})
    },
    getUserCommentInfo: async (req, res) => {
        const {username} = req.params

        const findUser = await userSchema.findOne({username})
        const user = {
            username: findUser.username,
            userImage: findUser.userImage
        }
        res.send({success: true, user})
    },
    uploadComment: async (req, res) => {
        const {themeId, username, comment, urlRef} = req.body

        await themesSchema.findOneAndUpdate({_id: themeId}, {
            $push: {
                comments: {
                    username,
                    comment,
                    time: Date.now(),
                    urlRef
                }
            }
        }, {new: true})

        await userSchema.findOneAndUpdate({username}, {
            $push: {
                comments: {
                    username,
                    comment,
                    time: Date.now()
                }
            }
        }, {new: true})
        // const topic = await themesSchema.findOne({_id: themeId})

        // if (topic.username !== username) await userSchema.updateMany({username: topic.username}, {
        //     $push: {
        //         notifications: {
        //             topicId: topic._id,
        //             topicTitle: topic.title,
        //             username
        //         }
        //     }
        // })

        const topic = await themesSchema.findOne({_id: themeId})

        if (topic.username !== username) {
            const notification = await new notificationSchema({
                themeId,
                username: topic.username,
                title: topic.title,
                commentLeftBy: username
            })
            await notification.save()
        }

        res.send({success: true, topic})
    },
    getMyTopics: async (req, res) => {
        const {username} = req.params

        const myTopics = await themesSchema.find({username})

        res.send({success: true, myTopics})
    },
    getMyComments: async (req, res) => {
        const {username} = req.params

        const findUser = await userSchema.findOne({username})

        res.send({success: true, myComments: findUser.comments})
    },
    changeUserImg: async (req, res) => {
        const {username, imgUrl} = req.body

        const findUser = await userSchema.findOneAndUpdate({username}, {userImage: imgUrl}, {new: true})
        const user = {
            username,
            userImage: findUser.userImage,
            themes: findUser.themes,
            notifications: findUser.notifications
        }
        res.send({success: true, user})
    },
    getNotifications: async (req,res) => {
        const {username} = req.session
        const findNotifications = await notificationSchema.find({username, read: false})

        res.send({success: true, findNotifications})


    }

}

