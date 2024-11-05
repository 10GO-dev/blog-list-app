const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blog = require('../models/blog')
const helper = require('./test_helper')


const blogs = helper.initialBlogs
describe('List Helper', () => {


  describe('dummy', () => {
    test('dummy returns one', () => {
      const result = listHelper.dummy(blogs)
      assert.strictEqual(result, 1)
    })
  })


  describe('totalLikes', () => {
    test('totalLikes return 36', () => {
      const result = listHelper.totalLikes(blogs)
      assert.strictEqual(result, 36)
    })
  })

  describe('favoriteBlog', () => {
    test('return most liked blog', () => {
      const result = listHelper.favoriteBlog(blogs)

      assert.deepStrictEqual(result, {
        id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12
      })
    })
  })

  describe('mostBlogs', () => {
    test('return author with most blogs', () => {
      const result = listHelper.mostBlogs(blogs)

      assert.deepStrictEqual(result,{
        author: 'Robert C. Martin',
        blogs: 3
      })
    })
  })

  describe('mostLikes', () => {
    test('return author with most likes', () => {
      const result = listHelper.mostLikes(blogs)

      assert.deepStrictEqual(result, {
        author: 'Edsger W. Dijkstra',
        likes: 17
      })
    })
  })
})

