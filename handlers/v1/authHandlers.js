const {prisma} = require('./userHandler')
const bcrypt = require('bcrypt');
const {ACCES_TOKEN_SECRET} = process.env
const jwt = require("jsonwebtoken")


module.exports = {
    register : async (req,res,next) => {
                try {
                
                    const email = req.body.email
                    const password = req.body.password
                    const name = req.body.name
                    const identity_type = req.body.identity_type
                    const identity_number = req.body.identity_number
                    const address = req.body.address
                    const encryptedPassword = await bcrypt.hash(password, 10);
                
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
                            password : encryptedPassword,
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
    
        },

        login : async (req,res,next) => {
            try {
                const email = req.body.email
                const password = req.body.password

                if ((!email) || (!password)) throw new Error("email and password are required fields",{cause : 400}) 
                const foundUser = await prisma.users.findUnique({
                    where : {
                        email : email
                    }
                })
                console.log( foundUser);

                if (!foundUser) throw new Error("email or password is not valid")

                const encryptedPassword = foundUser.password

                const checkPassword = await bcrypt.compare(password,encryptedPassword)

                if (!checkPassword) throw new Error("email or password is not valid",{cause : 400})

                const accesToken = jwt.sign({
                    id : foundUser.id,
                    name : foundUser.name
                },ACCES_TOKEN_SECRET)

                const result = {
                    status : 'success',
                    message : 'login succes! ',
                    data : {
                        user : foundUser,
                        accesToken : accesToken
                    }
                }

                res
                .status(200)
                .json(result)

            } catch (err) {
                next(err)
            }
        },

        authenticate  : async (req,res,next) => {
            try {
                let  authorization  = req.headers['authorization'];                console.log(authorization);
                if (!authorization) throw new Error("invalid token", {cause : 401})
                authorization = authorization.split(' ')[1];
                const decoded = await jwt.verify(authorization,process.env.ACCES_TOKEN_SECRET)
                req.user = await prisma.users.findUnique({
                    where : {
                        id : decoded.id
                    }
                })
                

                const result = {
                    status : 'success',
                    message : 'authenticated!',
                    data : {
                        user : decoded,
                        accesToken : authorization
                    }
                }

                res
                .status(200)
                .json(result)
            } catch (err) {
                console.log(err.name);
                if (err.name === "JsonWebTokenError") err.cause = 401
                    
                next(err)
            }
        }
    
    }
