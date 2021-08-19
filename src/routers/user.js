const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const mail = require('../emails/account')
const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')
const router = new express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
      await user.save()
      const token = await user.generateAuthToken()
      mail.sendWelcomeEmail(user)
      res.status(201).send({user, token})
  
     }catch(e){
      res.status(400).send({
          error : 'unable to create user',
          message : e.message
      })
    } 
  })
  

  router.post('/users/login', async (req, res) => {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password)
            const token = await user.generateAuthToken()
            res.send({user, token})
        } catch (e) {
            res.status(500).send({
                error : 'Server could not handle login',
                message : e.message
            })
        }
  })

    router.post('/users/logout', auth, async (req, res) => {
        try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token 
        })
        await req.user.save()  
        res.send({
            message : 'user logged out successfully'
        })
        } catch (e) {
            res.status(500).send({
                error : 'logout failed',
                message : e
            })
        }
    })

    router.post('/users/logout/all', auth, async (req, res) => {
        try {
            req.user.tokens = []
            await req.user.save()
            res.send({
                message : 'successfully logged out all users'
            })
        } catch (e) {
            res.status(500).send({
                error : 'unable to logout all devices',
                message : e
            })
        }
    })

    router.get('/users/me', auth, async (req, res) => {
        try {
            res.send(req.user)  
        } catch (e) {
            res.send({
             error : 'unable to access user',
            message : e.message
            })
        }
        
    })
  
  router.patch('/users/me', auth, async (req, res) => {
      const updates = Object.keys(req.body)
      const allowedUpdates = ['name', 'password', 'age']
      const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
      
      if(!isValidOperation){
          return res.status(400).send({
              error : 'invalid update parameters'
          })
      }
      try {
        
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()
        return res.send(req.user) 

      } catch (e) {
          res.status(500).send({
              error : 'could not apply update',
              message : e.message
          })
      }
  })
  
  router.delete('/users/me', auth, async (req, res) => {
      try {
        if(req.user.cloudinary_id){
            await cloudinary.uploader.destroy(req.user.cloudinary_id)
        }
          await req.user.remove()
          
          res.send(req.user)
  
      } catch (e) {
          res.status(500).send({
              error : 'Invalid request',
              message : e
          })
      }
  })

  router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        if(req.user.cloudinary_id){
            await cloudinary.uploader.destroy(req.user.cloudinary_id)
        }
      const result = await cloudinary.uploader.upload(req.file.path, {quality: 'auto', folder: 'avatars'})
      req.user.avatar = result.secure_url
      req.user.cloudinary_id = result.public_id
      
      await req.user.save()
      res.status(201).send({
          message : 'image uploaded successfully',
          avatar : req.user.avatar,
         
      })
    } catch (e) {
        return res.status(500).send({
            error : 'Could not upload image',
            message : e.message
        })
    }    
  
  })

  

  router.delete('/users/me/avatar', auth, async (req, res) => {
      try {
          
          await cloudinary.uploader.destroy(req.user.cloudinary_id)
          req.user.avatar = undefined
          req.user.cloudinary_id = undefined
          await req.user.save()
          res.send({
              message : 'avatar deleted successfully'
          })
      } catch (e) {
          res.status(500).send({
              error : 'unable to delete avatar',
              message : e.message
          })
      }

      
  })

  router.get('/users/:id/avatar', async (req, res) => {
        try {
            console.log(await User.find({}).exec())
            const user = await User.findById(req.params.id)

            if(!user || !user.avatar){
                throw new Error('resource not found')
            }
            res.send({
                avatar : user.avatar
            })
        } catch (e) {
            res.status(400).send({
                error : 'cannot get avatar',
                message : e.message
            })
        }

  })

  
  
  module.exports = router

