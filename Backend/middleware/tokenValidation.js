const jwt = require('jsonwebtoken')

module.exports.validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const match = authHeader && authHeader.match(/^Bearer\s+(.+)$/i)

  if (!match) {
    return res.status(401).send({ status: 401, message: 'Token is missing from header' })
  }

  try {
    const decodedToken = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] })
    req.userId = decodedToken.id
    return next()
  } catch (error) {
    console.error('Error in tokenValidation.js', error)
    return res.status(401).send({ status: 401, message: error.message })
  }
}
