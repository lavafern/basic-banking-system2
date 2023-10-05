const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const UserHandler = () => {
    
    const createUser = async (req,res,next) => {

        try {

            const email = req.body.email
            const name = req.body.name
            const newUser = await prisma.users.create({
                data : {
                    email : email,
                    name : name
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
            const users = await prisma.users.findMany()

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
        }
    }

    const showUserById = async (req,res,next) => {
        try {
            const id = parseInt(req.params.userid)
            const foundUser  = await prisma.users.findFirstOrThrow({
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



    return {
        createUser,
        showUser,
        showUserById

    }
}

module.exports = {UserHandler}



