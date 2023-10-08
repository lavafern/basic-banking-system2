const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

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

    

    return {
        createUser,
        showUser,
        showUserById,
        updateUser,
        deleteUser,
        updateProfile
    }
}

module.exports = {UserHandler,prisma}
