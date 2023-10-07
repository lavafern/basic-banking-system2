const express = require('express')
const router = express.Router()
const {UserHandler} = require('../../handlers/v1/bank')

router.post('/users',UserHandler().createUser)
router.get('/users',UserHandler().showUser)
router.get('/users/:userid',UserHandler().showUserById)

router.post('/accounts',UserHandler().createAccount)
router.get('/accounts',UserHandler().showAccounts)
router.get('/accounts/:accountid',UserHandler().showAccountsById)

router.post('/transactions',UserHandler().createTransaction)
router.get('/transactions',UserHandler().showTransactions)
router.get('/transactions/:transactionId',UserHandler().showTransactionsById)

router.put('/withdraw',UserHandler().withdraw)
router.put('/deposit',UserHandler().deposit)


module.exports = router

