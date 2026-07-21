const User = require('../database/models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0

const invalidInputError = () => {
  const error = new Error('Email, password, first name and last name are required')
  error.statusCode = 400
  return error
}

const invalidCredentialsError = () => {
  const error = new Error('Invalid email or password')
  error.statusCode = 401
  return error
}

const notFoundError = () => {
  const error = new Error('User not found')
  error.statusCode = 404
  return error
}

module.exports.createUser = async ({ email, password, firstName, lastName }) => {
  if (!isNonEmptyString(email) || !isNonEmptyString(password) || !isNonEmptyString(firstName) || !isNonEmptyString(lastName)) {
    throw invalidInputError()
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    const error = new Error('Email already exists')
    error.statusCode = 409
    throw error
  }

  const hashPassword = await bcrypt.hash(password, 12)
  const newUser = new User({ email, password: hashPassword, firstName, lastName })
  const result = await newUser.save()

  return result.toObject()
}

module.exports.loginUser = async ({ email, password }) => {
  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    throw invalidCredentialsError()
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw invalidCredentialsError()
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw invalidCredentialsError()
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

  return { token }
}

module.exports.getUserProfile = async ({ userId }) => {
  const user = await User.findOne({ _id: userId })

  if (!user) {
    throw notFoundError()
  }

  return user.toObject()
}

module.exports.updateUserProfile = async ({ userId, firstName, lastName }) => {
  const user = await User.findOneAndUpdate({ _id: userId }, { firstName, lastName }, { new: true })

  if (!user) {
    throw notFoundError()
  }

  return user.toObject()
}
