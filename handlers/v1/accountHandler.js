const {validAccNumber} = require('../../helpers/index')
const {prisma} = require('./userHandler')

const accountHandler = () => {
    const createAccount = async (req,res,next) => {
        try {
            const bankName = req.body.bankName 
            const balance = req.body.balance
            const userId = req.body.userId
            let bank_account_number = await validAccNumber(prisma.bank_accounts.findMany)

            
            //checkid
            await prisma.users.findUniqueOrThrow({ 
                where: {
                    id : 'asdasdasdsadasdsadsa'
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

    return {
        createAccount,
        showAccounts,
        showAccountsById,
        updateAccount,
        deleteAccount
    }

}

module.exports = {accountHandler}


