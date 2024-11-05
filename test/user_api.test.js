const bcrypt = require('bcryptjs')
const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const api = supertest(app)

describe('user creation test', () => {

  beforeEach( async() => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await	user.save()

  })

  test('username with less than 3 character return 400', async() => {
    const newUser = {
      username: 'ma',
      name: 'Manuel',
      password: 'q1234'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

  })

  test('password with less than 3 character return 400', async() => {
    const newUser = {
      username: 'manuel',
      name: 'Manuel',
      password: 'q1'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

})

after( async () => {
  mongoose.connection.close()
})

