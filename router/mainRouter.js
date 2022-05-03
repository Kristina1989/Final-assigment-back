const express = require('express')
const router = express.Router()
const {loggedIn, register, login, logout, uploadTheme, getTopics, getTheme, getUserCommentInfo, uploadComment,
   getMyTopics, getMyComments, changeUserImg, getNotifications} = require('../controllers/mainController')
const {regValidator, loginValidator, userLoggedInValidation, uploadThemeValidator,
   } =require('../middleware/validator')

router.get('/loggedIn', loggedIn)
router.post('/register', regValidator, register)
router.post('/login', loginValidator, login)
router.get('/logout', logout)
router.post('/upload', userLoggedInValidation, uploadThemeValidator, uploadTheme)
router.get('/getAllTopics', getTopics)
router.get('/getTheme/:_id', getTheme)
router.get('/getUserCommentInfo/:username', getUserCommentInfo)
router.post('/uploadComment', userLoggedInValidation, uploadComment)
router.get('/getMyTopics/:username', userLoggedInValidation, getMyTopics)
router.get('/getMyComments/:username', userLoggedInValidation, getMyComments)
router.post('/changeUserImg', userLoggedInValidation, changeUserImg)
router.get('/getNotifications',getNotifications)



module.exports = router