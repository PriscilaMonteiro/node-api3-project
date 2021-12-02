const yup = require('yup')

const userSchema = yup.object().shape({
  name: yup
    .string()
    .typeError('name needs to be a string')
    .trim('whitespace alone does not count')
    .required('you NEEED to supply name')
    .min(3, 'name needs to be 3 chars long')
    .max(100, 'name cannot be longer than 100')
})

const postSchema = yup.object().shape({
  text: yup
    .string()
    .typeError('name needs to be a string')
    .trim('whitespace alone does not count')
    .required('you NEEED to supply a text')
    .min(3, 'text needs to be 3 chars long')
    .max(500, 'text cannot be longer than 500')
})

module.exports = {
  userSchema,
  postSchema,
};