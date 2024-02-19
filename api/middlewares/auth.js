const jwt = require('jsonwebtoken')
const config = require('../configs/config')

const auth = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (!token) {
    return res.status(401).json({ msg: 'Invalid permission' })
  }

  try {
    const payload = jwt.verify(token, config.jwt.signature)
    req.usuario = payload
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Invalid token' })
  }
}

module.exports = auth
