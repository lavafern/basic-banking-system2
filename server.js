require('dotenv').config()
const express = require('express')
const app = express()

const v1Router = require('./routes/v1/index')

app.use(express.json())
app.use('/api/v1', v1Router)







app.use((err,req,res,next) => {
    if (err.cause === 400) {
        return res.status(400).json({
            status : "error",
            message : "bad request",
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