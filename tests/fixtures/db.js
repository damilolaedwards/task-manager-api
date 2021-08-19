const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const testUserId = new mongoose.Types.ObjectId()

const testUser = {
    _id : testUserId,
    name : 'Brainy Codelab',
    email : 'brainycodelab@gmail.com',
    password : 'brainy.123!',
    tokens : [{
        token : jwt.sign({_id : testUserId}, process.env.JWT_SECRET)
    }]
}
const secondTestUserId = new mongoose.Types.ObjectId

const secondTestUser = {
    _id : secondTestUserId,
    name : 'Ibrahim Abubakar',
    email : 'Ibroabu@gmail.com',
    password : '123456789',
    tokens : [
        {token : jwt.sign({_id : secondTestUserId}, process.env.JWT_SECRET)}
    ]
}


const firstTask = {
    _id : new mongoose.Types.ObjectId,
    description : 'Learn data structures and algorithm',
    owner : testUserId
}

const secondTask = {
    _id : new mongoose.Types.ObjectId,
    description : 'Learn databases',
    completed : true,
    owner : secondTestUserId
}

const thirdTask = {
    _id : new mongoose.Types.ObjectId,
    description : 'Learn AWS',
    completed : true,
    owner : secondTestUserId
}

const setUpDatabase = async () => {
    await Task.deleteMany()
    await User.deleteMany()
    await new User(testUser).save()
    await new User(secondTestUser).save()
    await new Task(firstTask).save()
    await new Task(secondTask).save()
    await new Task(thirdTask).save()
}

module.exports = {
    testUserId, secondTestUserId, testUser, secondTestUser, setUpDatabase
}