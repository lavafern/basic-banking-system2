require('dotenv').config()
const express = require('express')
const {Prisma} = require('@prisma/client')
const app = express()
const {PORT} = process.env

const v1Router = require('./routes/v1/index')

app.use(express.json())
app.use('/api/v1', v1Router)


app.use((req,res,next) => {
    res.status(404).json({
        status : "error",
        message : "404 not found",
        data : null
    })
})
app.use((err,req,res,next) => {
    res.status(500).json({
        status : "error",
        message : "internal server error!",
        data : err.message
    })
})
app.listen(PORT,() => {
    console.log('listening to port',PORT);
})