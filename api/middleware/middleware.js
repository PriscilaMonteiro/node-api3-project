const User = require('../users/users-model');
const yup = require('yup');

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

const userSchema = yup.object().shape({
  name: yup
    .string()
    .typeError('name needs to be a string')
    .trim('whitespace alone does not count')
    .required('you NEEED to supply name')
    .min(3, 'name needs to be 3 chars long')
    .max(100, 'name cannot be longer than 100')
})


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

const postSchema = yup.object().shape({
  text: yup
    .string()
    .typeError('name needs to be a string')
    .trim('whitespace alone does not count')
    .required('you NEEED to supply a text')
    .min(3, 'text needs to be 3 chars long')
    .max(500, 'text cannot be longer than 500')
})

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