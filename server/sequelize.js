const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './test.db',
});

const User = sequelize.define('user', {
  name: DataTypes.STRING,
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isInt: true,
    },
  },
});

const Watchlist = sequelize.define('watchlist', {
  showId: DataTypes.INTEGER,
  showName: DataTypes.STRING,
  imagePath: DataTypes.STRING,
  date: DataTypes.DATEONLY,
  type: DataTypes.STRING,
});

Watchlist.belongsTo(User, {
  onDelete: 'CASCADE',
});

module.exports = sequelize;
