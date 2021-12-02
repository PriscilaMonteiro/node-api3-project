const express = require('express');
const { logger } = require('./middleware/middleware');
const server = express();

const usersRouter = require('./users/users-router');


server.use(express.json());

server.use('/api/users', logger, usersRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('*', (req, res) => {
  // catch all 404 errors middleware
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found!` });
});

module.exports = server;
