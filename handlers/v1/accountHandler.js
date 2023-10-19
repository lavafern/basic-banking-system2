const {validAccNumber} = require('../../helpers/index')
const {prisma} = require('./userHandler')

const accountHandler = () => {
    const createAccount = async (req,res,next) => {
        try {
            const bankName = req.body.bankName 
            const balance = Number(req.body.balance)
            const userId = Number(req.body.userId)
            let bank_account_number = await validAccNumber(prisma.bank_accounts.findMany)

            if (!(bankName) || !(balance) || !(userId) || !(bank_account_number))  throw new Error("bank name, balance, and userid are required fields",{cause : 400}) 

            //checkid
            const checkid = await prisma.users.findUnique({ 
                where: {
                    id : userId
                }
            })

            if (!checkid) throw new Error("Userid not exist", {cause : 400})

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
            const foundAccount  = await prisma.bank_accounts.findUnique({
                where: {
                    id : id
                }
            })

            if (!foundAccount) throw new Error("no bank account found",{cause : 400})

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
            const accountId = Number(req.params.accountid)
            const newBankName = req.body.bankName

            const foundAccount  = await prisma.bank_accounts.findUnique({
                where: {
                    id : accountId
                }
            })

            if (!(accountId) || !(newBankName) )  throw new Error("bank name required fields",{cause : 400}) 
            if (!foundAccount) throw new Error("no bank account found",{cause : 400})

            const foundUser = await prisma.bank_accounts.update({
                where : {
                    id : accountId
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
            const accountId = Number(req.params.accountid)


            const foundAccount  = await prisma.bank_accounts.findUnique({
                where: {
                    id : accountId
                }
            })

            if (!(accountId))   throw new Error("bank name required fields",{cause : 400}) 
            if (!foundAccount) throw new Error("no bank account found",{cause : 400})

            
            const deletedAcc = await prisma.bank_accounts.delete({
                where : {
                    id : accountId
                }
            })

            const result = {
                status : 'success',
                message : 'user deleted ! ',
                data : deletedAcc
            }
            res
            .status(201)
            .send(result)

        } catch (err) {
            next(err)
        }
    }

    return {
        createAccount,
        showAccounts,
        showAccountsById,
        updateAccount,
        deleteAccount
    }

}

module.exports = {accountHandler}


