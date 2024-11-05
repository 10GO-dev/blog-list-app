const _ = require('lodash')



const dummy = (blogs) => {
  if(blogs){
    return 1
  }
  return 0
}

const totalLikes = (blogs) => {
  return blogs.reduce((ac,cv) => {
    console.log(ac, cv)
    return (ac || 0) + cv.likes
  }, 0)
}

const favoriteBlog = (blogs) => {

  return blogs.reduce((mostLiked, blog) => blog.likes > mostLiked.likes?  blog : mostLiked)
}

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, 'author')
  const maxAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author])
  return {
    author: maxAuthor,
    blogs: authorCounts[maxAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null // or return an appropriate value when the array is empty
  }

  const authorLikes = _.reduce(blogs, (result, blog) => {
    result[blog.author] = (result[blog.author] || 0) + blog.likes
    return result
  }, {})

  const maxLikes = _.max(Object.values(authorLikes))
  const maxAuthor = _.findKey(authorLikes, (likes) => likes === maxLikes)

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}