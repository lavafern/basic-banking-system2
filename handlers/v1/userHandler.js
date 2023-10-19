const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const UserHandler = () => {
    
    const createUser = async (req,res,next) => {
        try {

            const email = req.body.email
            const password = req.body.password
            const name = req.body.name
            const identity_type = req.body.identity_type
            const identity_number = req.body.identity_number
            const address = req.body.address

            const checkIdentityNumber = await prisma.profiles.findMany({ 
                where: {
                    identity_number : identity_number
                }
            })

            const checkEmail = await prisma.users.findMany({ 
                where: {
                    email : email
                }
            })
            if (!(email) || !(name) || !(password) || !(identity_type) || !(identity_number) || !(address)) throw new Error("Name, password, email, identity type, identity number and address are required fields",{cause : 400}) 
            if (checkEmail.length > 0) throw new Error("email used by other user!",{cause : 400}) 
            if (checkIdentityNumber.length > 0) throw new Error("identity Number used by other user!",{cause : 400}) 

            const newUser = await prisma.users.create({
                data : {
                    email : email,
                    name : name,
                    password : password,
                    profiles : {
                        create : {
                            identity_type : identity_type,
                            identity_number : identity_number,
                            address : address
                        }
                    }
                } 
            })

            delete newUser.password

            const profile = await prisma.profiles.findFirst({
                where: {
                  user_id: newUser.id
                }
              })

            const result = {
                status : 'success',
                message : 'data added succesfully! ',
                data : {
                    newUser,
                    profile
                }
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
            if (isNaN(id)) throw new Error("Id should be number",{cause : 400})
            
            const foundUser  = await prisma.users.findUnique({
                where: {
                    id : id
                }
            })

            if (!foundUser) throw new Error("Id not found",{cause : 400})

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
            const NewPassword =  req.body.password

            if (isNaN(id)) throw new Error("Id should be number",{cause : 400})

            const idCheck  = await prisma.users.findUnique({
                where: {
                    id : id
                }
            })
            if (!(newEmail) || (!(newName)) || !(NewPassword) ) throw new Error("Name, password and email are required fields",{cause : 400}) 

            const checkEmail = await prisma.users.findUnique({
                where : {
                    email : newEmail
                }
            })

            if (!idCheck) throw new Error("Id not found",{cause : 400})
            if (checkEmail) throw new Error("Email already used",{cause : 400})

            const foundUser = await prisma.users.update({
                where : {
                    id : id
                },
                data: {
                    name : newName,
                    email : newEmail,
                    password : NewPassword
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

            const idCheck  = await prisma.users.findUnique({
                where: {
                    id : id
                }
            })

            if (isNaN(id)) throw new Error("Id should be number",{cause : 400})
            if (!idCheck) throw new Error("Id not found",{cause : 400})

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
            .status(201)
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

            const idCheck  = await prisma.users.findUnique({
                where: {
                    id : userid
                }
            })

            const checkIdentityNumber = await prisma.profiles.findMany({ 
                where: {
                    identity_number : identity_number
                }
            })

            if (isNaN(userid)) throw new Error("Id should be number",{cause : 400})
            if (!idCheck) throw new Error("Id not found",{cause : 400})
            if (!(identity_type) || (!(identity_number)) || !(address) ) throw new Error("identity number, indentity type and addres are required fields",{cause : 400}) 
            if (checkIdentityNumber.length >0) throw new Error("identity Number used by other user!",{cause : 400}) 
            
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
