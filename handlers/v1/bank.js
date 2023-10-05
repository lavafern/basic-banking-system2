const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const {generateaAccNumber} = require('../../helpers/index')

const UserHandler = () => {
    
    const createUser = async (req,res,next) => {

        try {

            const email = req.body.email
            const name = req.body.name
            const identity_type = req.body.identity_type
            const identity_number = req.body.identity_number
            const address = req.body.address
            const newUser = await prisma.users.create({
                data : {
                    email : email,
                    name : name,
                    profiles : {
                        create : {
                            identity_type : identity_type,
                            identity_number : identity_number,
                            address : address
                        }
                    }
                } 
            })

            const result = {
                status : 'success',
                message : 'data added succesfully! ',
                data : newUser
            }
        
            res
            .status(201)
            .json(result)
            
        } catch (err) {
            next(err)
        }


    }

    const showUser = async (req,res,next) => {

        try {
            let users = await prisma.users.findMany()

            users = users.length > 0 ? users : 'no data'

            const result = {
                status : 'success',
                message : 'data fetched succesfully! ',
                data : users
            }

            res
            .status(200)
            .send(result)

        } catch(err) {
            console.log(err);
            next(err)
        }
    }

    const showUserById = async (req,res,next) => {
        try {
            const id = parseInt(req.params.userid)
            const foundUser  = await prisma.users.findUniqueOrThrow({
                where: {
                    id : id
                }
            })

            const result = {
                status : 'success',
                message : 'data fetched succesfully! ',
                data : foundUser
            }

            res
            .status(200)
            .send(result)

        } catch(err) {
            console.log(err);
            next(err)
        }
    }


    const createAccount = async (req,res,next) => {
        try {
            const bankName = req.body.bankName 
            const balance = req.body.balance
            const userId = req.body.userId
            const bank_account_number = generateaAccNumber()
            
            //checkid
            await prisma.users.findUniqueOrThrow({ 
                where: {
                    id : userId
                }
            })

            const newAccount = await prisma.bank_accounts.create({
                data : {
                    bank_name : bankName,
                    bank_account_number : bank_account_number,
                    balance : balance,
                    user_id : userId
                }
            })


            const result = {
                status : "succes",
                message : "create new bank account succes!",
                data : newAccount
            }

            res
            .status(201)
            .send(result)

        } catch (err) {
            console.log(err);
            next(err)
        }
    }

    const showAccounts = async (req,res,next) => {

        try {
            let accounts = await prisma.bank_accounts.findMany()

            accounts = accounts.length > 0 ? accounts : 'no data'

            const result = {
                status : 'success',
                message : 'data fetched succesfully! ',
                data : accounts
            }

            res
            .status(200)
            .send(result)

        } catch(err) {
            console.log(err);
            next(err)
        }
    }

    const showAccountsById = async (req,res,next) => {
        try {
            const id = parseInt(req.params.accountid)
            const foundUser  = await prisma.bank_accounts.findUniqueOrThrow({
                where: {
                    id : id
                }
            })

            const result = {
                status : 'success',
                message : 'data fetched succesfully! ',
                data : foundUser
            }

            res
            .status(200)
            .send(result)

        } catch(err) {
            console.log(err);
            next(err)
        }
    }

    const doTransaction = async (req,res,next) => {

        try{
        const amount = parseInt(req.body.amount)
        const sourceId = parseInt(req.body.sourceId)
        const destinatonId = parseInt(req.body.destinatonId)

        const sender = prisma.bank_accounts.update({
            where: { 
                id : sourceId
            },
            data: {
                balance : {
                    increment : -amount
                }
              },
        })

        const receiver = prisma.bank_accounts.update({
            where: { 
                id : destinatonId
            },
            data: {
                balance : {
                    increment : amount
                },
              },
        })

        const transactionRecord = prisma.transactions.create({
            data : {
                source_account_id : sourceId,
                destination_account_id : destinatonId
            }
        })

        const transactionPrisma = await prisma.$transaction([sender,receiver,transactionRecord])

        console.log(transactionPrisma);
        const result = {
            status : "succes",
            message : "succes do transaction!",
            data : transactionPrisma
        }

        res
        .status(201)
        .send(result)

        } catch (err) {
            console.log(err);
            next(err)
        }

    }

    return {
        createUser,
        showUser,
        showUserById,
        createAccount,
        showAccounts,
        showAccountsById,
        doTransaction
    }
}

module.exports = {UserHandler}



