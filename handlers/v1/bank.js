const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const {validAccNumber} = require('../../helpers/index')

const UserHandler = () => {
    
    const createUser = async (req,res,next) => {

        try {

            const email = req.body.email
            const name = req.body.name
            const identity_type = req.body.identity_type
            const identity_number = req.body.identity_number
            const address = req.body.address

            const checkIdentityNumber = await prisma.profiles.findMany({ 
                where: {
                    identity_number : identity_number
                }
            })

            if (checkIdentityNumber.length > 0) throw new Error("identity Number used by other user!") 

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
            let users = await prisma.users.findMany({
                include : {
                    profiles : {
                        select : {
                            identity_type : true,
                            identity_number : true,
                            address : true
                        }
                    }
                }
            })
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
            next(err)
        }
    }

    const showUserById = async (req,res,next) => {
        try {
            const id = Number(req.params.userid)
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
            next(err)
        }
    }

    const updateUser = async (req,res,next) => {
        try {
            const id = Number(req.params.id)
            const newName = req.body.name
            const newEmail = req.body.email
            const foundUser = await prisma.users.update({
                where : {
                    id : id
                },
                data: {
                    name : newName,
                    email : newEmail
                  }
            })

            const result = {
                status : 'success',
                message : 'user updated succesfully! ',
                data : foundUser
            }
            res
            .status(201)
            .send(result)

        } catch (err) {
            next(err)
        }
    }

    const deleteUser = async (req,res,next) => {
        try {
            const id = Number(req.params.id)

            const deletedUser = await prisma.users.delete({
                where : {
                    id : id
                }
            })

            const result = {
                status : 'success',
                message : 'user deleted ! ',
                data : deletedUser
            }
            res
            .status(200)
            .send(result)

        } catch (err) {
            next(err)
        }
    }

    const updateProfile = async (req,res,next) => {
        try {
            const userid = Number(req.params.id)
            const identity_type = req.body.identity_type
            const identity_number = req.body.identity_number
            const address = req.body.address
            const checkIdentityNumber = await prisma.profiles.findMany({ 
                where: {
                    identity_number : identity_number
                }
            })

            if (checkIdentityNumber.length >0) throw new Error("identity Number used by other user!") 
            const profile = await prisma.profiles.update({
                where : {
                    user_id : userid
                },
                data : {
                    identity_type : identity_type,
                    identity_number : identity_number,
                    address : address
                }
            })

            const result = {
                status : 'success',
                message : 'profile updated succesfully! ',
                data : profile
            }
            res
            .status(201)
            .send(result)

        } catch (err) {
            next(err)
        }
    }

    const createAccount = async (req,res,next) => {
        try {
            const bankName = req.body.bankName 
            const balance = req.body.balance
            const userId = req.body.userId
            let bank_account_number = await validAccNumber(prisma.bank_accounts.findMany)

            
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
            next(err)
        }
    }

    const showAccountsById = async (req,res,next) => {
        try {
            const id = Number(req.params.accountid)
            const foundAccount  = await prisma.bank_accounts.findUniqueOrThrow({
                where: {
                    id : id
                }
            })

            const result = {
                status : 'success',
                message : 'data fetched succesfully! ',
                data : foundAccount
            }

            res
            .status(200)
            .send(result)

        } catch(err) {
            next(err)
        }
    }

    const updateAccount = async (req,res,next) => {
        try {
            const accointId = Number(req.params.id)
            const newBankName = req.body.bankName
            const foundUser = await prisma.bank_accounts.update({
                where : {
                    id : accointId
                },
                data: {
                    bank_name : newBankName
                  }
            })

            const result = {
                status : 'success',
                message : 'Bank updated succesfully! ',
                data : foundUser
            }
            res
            .status(201)
            .send(result)

        } catch (err) {
            next(err)
        }
    }

    const deleteAccount = async (req,res,next) => {
        try {
            const bankId = Number(req.params.bankId)

            const deletedAcc = await prisma.bank_accounts.delete({
                where : {
                    id : bankId
                }
            })

            const result = {
                status : 'success',
                message : 'user deleted ! ',
                data : deletedAcc
            }
            res
            .status(200)
            .send(result)

        } catch (err) {
            next(err)
        }
    }



    const createTransaction = async (req,res,next) => {

        try{
        const tfAmount = Number(req.body.amount)
        const sourceId = Number(req.body.sourceId)
        const destinatonId = Number(req.body.destinatonId)

        if (isNaN(tfAmount)) throw new Error("Not a number")

        const sender = prisma.bank_accounts.update({
            where: { 
                id : sourceId
            },
            data: {
                balance : {
                    increment : -tfAmount
                }
              }
        })

        const receiver = prisma.bank_accounts.update({
            where: { 
                id : destinatonId
            },
            data: {
                balance : {
                    increment : tfAmount
                },
              }
        })
        const transactionRecord = prisma.transactions.create({
            data : {
                source_account_id : sourceId,
                destination_account_id : destinatonId,
                amount : tfAmount
            }
        })

        const transactionPrisma = await prisma.$transaction([sender,receiver,transactionRecord])

        const result = {
            status : "succes",
            message : "succes do transaction!",
            data : transactionPrisma
        }

        res
        .status(201)
        .send(result)

        } catch (err) {
            next(err)
        }

    }

    const showTransactions = async (req,res,next) => {
        try {
            let transactions = await prisma.transactions.findMany()
            transactions = transactions.length > 0 ? transactions : 'no data'
            
            const result = {
                status : "succes",
                message : "succes fetch all transaction!",
                data : transactions
            }

            res
            .status(200)
            .send(result)
        } catch (err) {
            next(err)
        }
    }

    const showTransactionsById = async (req,res,next) => {
        try {
            const id = Number(req.params.transactionId)
            const foundTransaction  = await prisma.transactions.findUniqueOrThrow({
                where: {
                    id : id
                }
            })
            const names = await prisma.bank_accounts.findMany({
                select : {
                    bank_name : true
                },
                where : {
                    OR : [
                        { id: foundTransaction.source_account_id },
                        { id: foundTransaction.destination_account_id },
                    ]
                }
            })

            foundTransaction.source_account_name = names[0].bank_name
            foundTransaction.destination_account_name = names[1].bank_name

            const result = {
                status : 'success',
                message : 'data fetched succesfully! ',
                data : foundTransaction
            }

            res
            .status(200)
            .send(result)

        } catch(err) {
            next(err)
        }
    }

    const withdraw = async (req,res,next) => {
        try {
            const amount = req.body.amount
            const bankId = req.body.bankId
            if (isNaN(amount)) throw new Error("Not a number")


            const withdrawData = await prisma.bank_accounts.update({
                where: { 
                    id : bankId
                },
                data: {
                    balance : {
                        increment : -amount
                    }
                  }
            })

            const result = {
                status : 'success',
                message : 'withdraw succes!',
                data : withdrawData
            }

            res
            .status(201)
            .send(result)


        } catch (err) {
            next(err)
        }  
       
    }

    const deposit = async (req,res,next) => {
        try {
            const amount = req.body.amount
            const bankId = req.body.bankId
            if (isNaN(amount)) throw new Error("Not a number")

            const depositData = await prisma.bank_accounts.update({
                where: { 
                    id : bankId
                },
                data: {
                    balance : {
                        increment : amount
                    }
                  }
            })

            const result = {
                status : 'success',
                message : 'deposit succes!',
                data : depositData
            }

            res
            .status(201)
            .send(result)

        } catch (err) {
            next(err)
        }
    }

    return {
        createUser,
        showUser,
        showUserById,
        updateUser,
        deleteUser,
        updateProfile,
        createAccount,
        showAccounts,
        showAccountsById,
        updateAccount,
        deleteAccount,
        createTransaction,
        showTransactions,
        showTransactionsById,
        withdraw,
        deposit
    }
}

module.exports = {UserHandler}
