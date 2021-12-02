const User = require('../users/users-model');
const {userSchema, postSchema} = require('./schema');

function errorHandling(err, req, res, next) { // eslint-disable-line
  res.status(err.status || 500).json({
    message: `Something went wrong: ${err.message}`,
    stack: err.stack,
  });
}

function logger(req, res, next) {
  const timestamp = new Date().toLocaleString()
  console.log(`[${timestamp}][${req.method}] ${req.url}`)
  next()
}


async function validateUserId(req, res, next) {
  try {
    const possibleUser = await User.getById(req.params.id)
    if(!possibleUser){
      next({ status: 404, message: 'user not found' })
    } else {
      req.user = possibleUser
      next();
    }
  } catch (err) {
    next(err)
  }
}


async function validateUser(req, res, next) {
 try {
    const validated = await userSchema.validate(
      req.body,
      { strict: false, stripUnknown: true }
    )
    req.body = validated
    next()
  } catch (err) {
    next({ message: "missing required name field", status: 400 })
  }
}


async function validatePost(req, res, next) {
  try {
    const validated = await postSchema.validate(
      req.body,
      { strict: false, stripUnknown: true }
    )
    req.body = validated
    next()
  } catch (err) {
    next({ message: "missing required text field", status: 400 })
  }
}

module.exports = {
  errorHandling,
  logger,
  validateUserId,
  validateUser,
  validatePost,
};