const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { default: mongoose } = require('mongoose')
const helper = require('./test_helper')

const api = supertest(app)
const testUser = helper.initialUsers[0]

beforeEach( async() => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(note => note.save())
  await Promise.all(promiseArray)

  await User.deleteMany({})
  const newUser = new User(testUser)
  await newUser.save()

})
describe('Blogs test', () => {

  test('return correct amount of blog posts in the JSON format', async () => {

    const blogs = await  api
      .get('/api/blogs')
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(blogs.body.length, helper.initialBlogs.length)
  })

  test('blogs unique identifier property is named \'id\'', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect('Content-Type', /application\/json/)

    const blog = blogs.body[0]
    assert(Object.keys(blog).includes('id'))
  })

  test.only('a new blog can be added', async() => {
    const loginUser = { username: testUser.username, password: testUser.password }
    console.log('loginUser:', loginUser)

    const loginResponse = await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token
    console.log('token:', token)

    const newBlog = {
      title: 'New Blog',
      author: 'Author Name',
      url: 'http://example.com',
      likes: 0,
      user: '67149acaae574137166ad678'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedBlog = response.body
    console.log('savedBlog:', savedBlog)

    assert.strictEqual(savedBlog.title, newBlog.title)
    assert.strictEqual(savedBlog.author, newBlog.author)
    assert.strictEqual(savedBlog.url, newBlog.url)
    assert.strictEqual(savedBlog.likes, newBlog.likes)
  })

  test('if missing likes property, default value is 0', async() => {
    const newBlog = {
      title: 'Blog de prueba',
      author: 'Diego Peralta',
      url: '',
      user: '67149acaae574137166ad678'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedBlog = response.body

    assert.strictEqual(savedBlog.likes, 0)
  })

  test('if missing title property, return 400', async() => {
    const newBlog = {
      author: 'Diego Peralta',
      url: '',
      likes: 0,
      user: '67149acaae574137166ad678'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

  })

  test('if missing url property, return 400', async() => {
    const newBlog = {
      title: 'Blog de prueba',
      author: 'Diego Peralta',
      likes: 0,
      user: '67149acaae574137166ad678'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

  })

})
after(async () => {
  await mongoose.connection.close()
})