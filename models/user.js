const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returndObject) => {
    returndObject.id = returndObject._id.toString()
    delete returndObject._id
    delete returndObject.__v
    // el passwordHash no debe mostrarse
    delete returndObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)