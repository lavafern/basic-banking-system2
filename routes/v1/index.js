const express = require('express')
const router = express.Router()
const {UserHandler} = require('../../handlers/v1/bank')

// router.get('/accounts',getAccounts)
// router.get('/deposit',deposit)
// router.get('/accounts',withdraw)

router.post('/users',UserHandler().createUser)
router.get('/users',UserHandler().showUser)
router.get('/users/:userid',UserHandler().showUserById)


// router.get('/users')
// router.post('/users')

// router.get('/users')
// router.post('/users')


module.exports = router

