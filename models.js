const sequelize = require("./db");

const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  },
  chatId: { type: DataTypes.STRING, unique: true },
  counter: { type: DataTypes.INTEGER, defaultValue: 0 },
  amountElephants: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = User;
