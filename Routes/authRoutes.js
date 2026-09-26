const express = require('express')
const router = express.Router()

const {register , login , logout} = require ('../Controllers/authenticationController')
const { authenticate} = require('../Middlewares/authentication')

// Because authenticate needs a token to already exist, and at register/login, one doesn't yet.
router.post('/register', register);

router.post('/login', login);

router.post('/logout', authenticate('header'), logout);


module.exports = router;