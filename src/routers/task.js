const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    
    const task = new Task({
        ...req.body, owner : req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send({
            error : 'Could not save task',
            message : e.message 
        })
    }
})

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

   if(req.query.completed){
    match.completed = req.query.completed === 'true'
   }

   if(req.query.sortBy){
       const parts = req.query.sortBy.split(':')
       sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
   }

    try{
        await req.user.populate({
            path : 'tasks', match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }, 
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send({
            error : 'Unable to handle request',
            message : e.message
        })
    }    
})

router.get('/tasks/:id', auth,  async (req, res) => {
    const _id = req.params.id
    try {
        const task =  await Task.findOne({_id , owner: req.user._id })
        if(!task){
            throw new Error('Unable to find task')
        }
         res.send(task)
    } catch (e) {
        return res.status(500).send({
            error : 'Unable to handle request',
            message : e.message
        })
    }
    
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updatables = ['description', 'completed']
    const updates = Object.keys(req.body)
    isValidUpdate = updates.every((update) => updatables.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({
            error : 'invalid update parameters'
        })
    }
    try {
        const task = await Task.findOne({_id : req.params.id, owner : req.user._id})
        if(!task){
            throw new Error('Task not found')
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
       
        res.send(task)
    } catch (e) {
        res.status(500).send({
            error : 'could not update task',
            message : e.message
        })
    }
})

router.delete('/tasks/:id', auth,  async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id})

        if(!task){
            throw new Error('Task not found')

        }
        res.send(task)
    } catch (e) {
        res.status(500).send({
            error : 'unable to delete task',
            message : e.message
        })
    }
})

module.exports = router