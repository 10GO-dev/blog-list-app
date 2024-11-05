const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)

})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if(username === undefined || password === undefined){
    return response.status(400).json( { error: 'missing username or password' })
  }else if(username.length < 3 || password.length < 3){
    return response.status(400).json( { error: 'username and passowrd must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hashSync(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)

})

module.exports = usersRouter