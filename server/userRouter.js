const _ = require('lodash');
const express = require('express');
const { StatusCodes } = require('http-status-codes');

const sequelize = require('./sequelize');

const userRouter = express.Router();
const { user: User } = sequelize.models;

const userAllowedFields = ['name', 'phonenumber'];

async function createUser(_data) {
  const data = _.pick(_data, userAllowedFields);
  const user = await User.create(data);
  return user.toJSON();
}

async function getUsers() {
  let users = await User.findAll();
  users = users.map((user) => user.toJSON());
  return users;
}

async function getUser(id) {
  const user = await User.findByPk(id);
  return user.toJSON();
}

async function updateUser(id, _data) {
  const data = _.pick(_data, userAllowedFields);
  await User.update(data, {
    where: {
      id,
    },
  });
}

async function deleteUser(id) {
  await User.destroy({
    where: {
      id,
    },
  });
}

userRouter.post('/', async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(StatusCodes.CREATED).json(user);
  } catch (err) {
    next(err);
  }
});

userRouter.put('/:id', async (req, res, next) => {
  try {
    const update = await updateUser(req.params.id, req.body);
    res.status(StatusCodes.NO_CONTENT).end();
  } catch (err) {
    next(err);
  }
});

userRouter.get('/', async (req, res, next) => {
  try {
    const users = await getUsers();
    if (!users) {
      res.status(StatusCodes.NOT_FOUND).end();
      return;
    }
    res.status(StatusCodes.OK).json(users);
  } catch (err) {
    next(err);
  }
});

userRouter.get('/:id', async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).end();
      return;
    }
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    next(err);
  }
});

userRouter.delete('/:id', async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    res.status(StatusCodes.NO_CONTENT).end();
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
