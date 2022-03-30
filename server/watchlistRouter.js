const _ = require('lodash');
const express = require('express');
const { StatusCodes } = require('http-status-codes');

const sequelize = require('./sequelize');

const watchlistRouter = express.Router();
const { watchlist: Watchlist } = sequelize.models;

const watchlistAllowedFields = ['userId', 'showId', 'date', 'type'];

async function createWatchlist(_data) {
  const data = _.pick(_data, watchlistAllowedFields);
  const existingWatchlist = await getWatchlist(data.userId);

  const existingMovies = existingWatchlist.map((watchlist) => {
    return watchlist.showId;
  });
  const exist = existingMovies.some((showId) => showId === Number(data.showId));
  if (!exist) {
    const watchlist = await Watchlist.create(data);
    return watchlist.toJSON();
  } else {
    return null;
  }
}

async function getWatchlist(userId) {
  let watchlist = await Watchlist.findAll({
    where: {
      userId,
    },
    include: ['user'],
  });
  watchlist = watchlist.map((w) => w.toJSON());
  return watchlist;
}

async function updateWatchlist(id, _data) {
  const data = _.pick(_data, watchlistAllowedFields);
  const existingWatchlist = await getWatchlist(data.userId);
  const existing = existingWatchlist.filter((list) => list.date === data.date);
  if (existing[0] !== undefined) {
    await Watchlist.update(
      { date: null },
      {
        where: {
          id: existing[0].id,
        },
      }
    );
  }
  await Watchlist.update(data, {
    where: {
      id,
    },
  });
}

async function deleteWatchlist(id) {
  await Watchlist.destroy({
    where: {
      id,
    },
  });
}

watchlistRouter.post('/', async (req, res, next) => {
  try {
    const watchlist = await createWatchlist(req.body);
    if (watchlist == null) {
      res.status(StatusCodes.FORBIDDEN).end();
    } else {
      res.status(StatusCodes.CREATED).json(watchlist);
    }
  } catch (err) {
    next(err);
  }
});

watchlistRouter.put('/:id', async (req, res, next) => {
  try {
    const update = await updateUser(req.params.id, req.body);
    res.status(StatusCodes.NO_CONTENT).end();
  } catch (err) {
    next(err);
  }
});

watchlistRouter.get('/user/:userId', async (req, res, next) => {
  try {
    const watchlist = await getWatchlist(req.params.userId);
    if (!watchlist) {
      res.status(StatusCodes.NOT_FOUND).end();
      return;
    }
    res.status(StatusCodes.OK).json(watchlist);
  } catch (err) {
    next(err);
  }
});

watchlistRouter.delete('/:id', async (req, res, next) => {
  try {
    await deleteWatchlist(req.params.id);
    res.status(StatusCodes.NO_CONTENT).end();
  } catch (err) {
    next(err);
  }
});

module.exports = watchlistRouter;
