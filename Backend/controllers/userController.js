const userService = require('../services/userService')

const runService = (serviceCall, successMessage) => async (req, res) => {
  try {
    const body = await serviceCall(req)
    return res.status(200).send({ status: 200, message: successMessage, body })
  } catch (error) {
    console.error('Error in userController.js', error)
    const status = error.statusCode || 500
    return res.status(status).send({ status, message: error.message })
  }
}

module.exports.createUser = runService((req) => userService.createUser(req.body), 'User successfully created')

module.exports.loginUser = runService((req) => userService.loginUser(req.body), 'User successfully logged in')

module.exports.getUserProfile = runService(
  (req) => userService.getUserProfile({ userId: req.userId }),
  'Successfully got user profile data'
)

module.exports.updateUserProfile = runService(
  (req) => userService.updateUserProfile({ userId: req.userId, firstName: req.body.firstName, lastName: req.body.lastName }),
  'Successfully updated user profile data'
)
