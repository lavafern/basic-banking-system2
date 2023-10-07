const express = require('express')
const router = express.Router()
const {UserHandler} = require('../../handlers/v1/bank')

router.post('/users',UserHandler().createUser)
router.get('/users',UserHandler().showUser)
router.get('/users/:userid',UserHandler().showUserById)
router.put('/users/:id',UserHandler().updateUser)
router.delete('/users/:id',UserHandler().deleteUser)
router.put('/profile/:id',UserHandler().updateProfile)

router.post('/accounts',UserHandler().createAccount)
router.get('/accounts',UserHandler().showAccounts)
router.get('/accounts/:accountid',UserHandler().showAccountsById)
router.put('/accounts/:id',UserHandler().updateAccount)
router.delete('/accounts/:bankId',UserHandler().deleteAccount)

router.post('/transactions',UserHandler().createTransaction)
router.get('/transactions',UserHandler().showTransactions)
router.get('/transactions/:transactionId',UserHandler().showTransactionsById)

router.put('/withdraw',UserHandler().withdraw)
router.put('/deposit',UserHandler().deposit)


module.exports = router

