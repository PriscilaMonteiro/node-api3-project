const express = require('express');

const {
  errorHandling,
  validateUserId,
  validateUser,
  validatePost,
} = require('../middleware/middleware');

const Posts = require('../posts/posts-model');
const Users = require('./users-model');
const router = express.Router();


router.get('/', (req, res, next) => {
  Users.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
});

router.get('/:id', validateUserId,(req, res) => {
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  Users.insert(req.body)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(next);
});


router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  Users.update(req.params.id, req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(next)
});


router.delete('/:id', validateUserId, (req, res, next) => {
  Users.remove(req.user.id)
    .then(() => {
      res.status(200).json(req.user);
    })
    .catch(next);
});

router.get("/:id/posts", validateUserId, async (req, res, next) => {
  try {
    const posts = await Users.getUserPosts(req.user.id);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});


router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  const {  text } = req.body;
  try {
    const newPost = await Posts.insert({ text, user_id: req.user.id })
      res.status(201).json(newPost);
    } catch (err) {
    next(err);
  }
});

router.use(errorHandling);
module.exports = router;