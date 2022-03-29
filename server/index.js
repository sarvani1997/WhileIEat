const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { prettify } = require('sql-log-prettifier');
const sequelize = require('./sequelize');
const luxon = require('luxon');

const userRouter = require('./userRouter');
const watchlistRouter = require('./watchlistRouter');

luxon.Settings.defaultZoneName = 'Asia/Kolkata';

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.options('*', cors());

app.use('/users', userRouter);
app.use('/watchlist', watchlistRouter);

app.get('/', (req, res) => {
  res.json({});
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ msg: 'Internal Server Error', error: err });
});

const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`Listening at localhost:3500`);
});

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({
      // force: true,
      logging: (s) => {
        const string = prettify(s);
        console.log(string);
      },
    });
    console.log('Connection has been established successfully..');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
