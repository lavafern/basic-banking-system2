const express = require('express')
const router = express.Router()
const {UserHandler} = require('../../handlers/v1/userHandler')
const {accountHandler} = require('../../handlers/v1/accountHandler')
const {transactionHandler} = require('../../handlers/v1/transactionHandler')


router.post('/users',UserHandler().createUser)
router.get('/users',UserHandler().showUser)
router.get('/users/:userid',UserHandler().showUserById)
router.put('/users/:id',UserHandler().updateUser)
router.delete('/users/:id',UserHandler().deleteUser)
router.put('/profile/:id',UserHandler().updateProfile)

router.post('/accounts',accountHandler().createAccount)
router.get('/accounts',accountHandler().showAccounts)
router.get('/accounts/:accountid',accountHandler().showAccountsById)
router.put('/accounts/:id',accountHandler().updateAccount)
router.delete('/accounts/:bankId',accountHandler().deleteAccount)

router.post('/transactions',transactionHandler().createTransaction)
router.get('/transactions',transactionHandler().showTransactions)
router.get('/transactions/:transactionId',transactionHandler().showTransactionsById)

router.put('/withdraw',transactionHandler().withdraw)
router.put('/deposit',transactionHandler().deposit)


module.exports = router

