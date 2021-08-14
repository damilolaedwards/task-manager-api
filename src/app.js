const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()

const mode = ''
app.use((req, res, next) => {
    if(mode === 'maintenance'){
       return res.status(503).send({
            error : 'Unable to access server',
            message : 'Server currently on maintenance mode, Kindly check back later'
        })
    }
    
    next()
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.use((req, res, next) => {
    res.status(404).send({
        error : 'Unable to complete request',
        message : 'Cannot find requested resource'
    })
});

module.exports = app

