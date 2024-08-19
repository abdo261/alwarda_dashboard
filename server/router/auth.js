const { register, login } = require('../controllers/auth')

const autheRouter = require('express').Router()

autheRouter.post('/register',register)
autheRouter.post('/login',login)

module.exports= autheRouter