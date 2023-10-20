const express = require('express')
const router = express.Router()
const {register,login,authenticate} = require("../../handlers/v1/authHandlers")

router.get('/',(req,res) => {
    res.send({hello : 'hello'})
})

/// /auth/register
router.post('/register',register)

/// /auth/login
router.post('/login',login)

/// /auth/authenticate
router.get('/authenticate',authenticate)



module.exports = router