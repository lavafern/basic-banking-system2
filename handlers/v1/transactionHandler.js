const {prisma} = require('./userHandler')

const transactionHandler = () => {
    const createTransaction = async (req,res,next) => {

        try{
        const tfAmount = Number(req.body.amount)
        const sourceId = Number(req.body.sourceId)
        const destinatonId = Number(req.body.destinatonId)
        const sourceIDBalance = await prisma.bank_accounts.findUnique({
            where: {
                id : sourceId
            }, select : {
                balance : true,
            }
        })

        const destinatonIdCheck = await prisma.bank_accounts.findUnique({
            where: {
                id : destinatonId
            }
        })

        if (!(tfAmount))  throw new Error("transfer amount are required fields",{cause : 400})
        if (!sourceIDBalance)  throw new Error("Sender account not exist", {cause : 400})
        if (!destinatonIdCheck)  throw new Error("Destination account not exist", {cause : 400})

        if (isNaN(tfAmount)) throw new Error("Not a number", {cause : 400})
        if (sourceId === destinatonId) throw new Error("Can't transfer to your own account", {cause : 400})
        if (sourceIDBalance.balance < tfAmount) throw new Error('your balance is not enough', {cause : 400})

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
            data : {
                sender : transactionPrisma[0],
                receiver : transactionPrisma[1],
                transaction : transactionPrisma[2]
            }
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
            const foundTransaction  = await prisma.transactions.findUnique({
                where: {
                    id : id
                }
            })

            if (!foundTransaction) throw new Error("Transaction id not found",{cause : 400})

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
            const amount = Number(req.body.amount)
            const bankId = req.body.bankId

            if (!amount) throw new Error("amount not valid",{cause : 400})
            if (isNaN(amount)) throw new Error("Not a number",{cause : 400})

            const bankIdCheck = await prisma.bank_accounts.findUnique({
                where: {
                    id : bankId
                }, select : {
                    balance : true
                }
            })

            if (!bankIdCheck) throw new Error("account not found", {cause : 400})

            if (amount > bankIdCheck.balance) throw new Error("not enough balance", {cause : 400})
    

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
            const amount = Number(req.body.amount)
            const bankId = req.body.bankId
            if (isNaN(amount)) throw new Error("Not a number",{cause : 400})

            if (!amount) throw new Error("amount not valid",{cause : 400})
            const bankIdCheck = await prisma.bank_accounts.findUnique({
                where: {
                    id : bankId
                }
            })
    
            if (!bankIdCheck) throw new Error("account not found",{cause : 400})


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
        createTransaction,
        showTransactions,
        showTransactionsById,
        withdraw,
        deposit
    }

}

module.exports = {transactionHandler}
