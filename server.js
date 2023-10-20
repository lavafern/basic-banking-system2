require('dotenv').config()
const express = require('express')
const app = express()

const v1Router = require('./routes/v1/index')
const authRouter = require("./routes/v1/auth")
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
app.use(express.json())
app.use('/api/v1', v1Router)
app.use('/api/v1/auth', authRouter)



app.use((err,req,res,next) => {
    if (err.cause === 400) {
        return res.status(400).json({
            status : "error",
            message : "bad request",
            data : err.message
        })
    }

    if (err.cause === 401) {
        return res.status(401).json({
            status : "error",
            message : "Unathorized",
            data : err.message
        })
    }
    
    
    res.status(500).json({
        status : "error",
        message : "internal server error!",
        data : err.message
    })
})



app.use((err,req,res,next) => {
    res.status(404).json({
        status : "error",
        message : "404 not found",
        data : null
    })
})

module.exports = {app}