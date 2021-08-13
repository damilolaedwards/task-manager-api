const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = mongoose.Schema({
    description : {
        type : String,
        required : [true, 'the description field is required'],
        trim : true,

    },
    completed : {
        type : Boolean,
        default : false
    }, 
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'

    }
    
},{
    timestamps : true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task