const express = require('express')
const router = express.Router()

const {register , login , logout, updatePassword,updateProfileImage} = require ('../Controllers/authenticationController')
const { authenticate} = require('../Middlewares/authentication')
const upload = require('../Middlewares/upload');


// Because authenticate needs a token to already exist, and at register/login, one doesn't yet.
// PUBLIC — no account/token exists yet
router.post('/register', register);

router.post('/login', login);

router.post('/logout', authenticate('header'), logout);

router.patch('/update-password', authenticate('header'), updatePassword);

router.patch('/update-profile-image', authenticate('header'), upload.single('image'), updateProfileImage);


module.exports = router;