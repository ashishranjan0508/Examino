const Sequelize = require('sequelize');
const sequelize = require('../config/db.js');

const Exam = sequelize.define("exam", {
   id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
   },

   teacherId: {             // Here userId is teacher
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
        model: "users",
        key: "id",
    }
   },

   title: {
    type: Sequelize.STRING,
    allowNull: false,
   },

   description: {
    type: Sequelize.STRING,
    allowNull: true,
   },

   duration: {
    type: Sequelize.INTEGER,        // time will be in minutes — handle the logic in server for hour
    allowNull: false,
   },

   joinCode: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,        // handle logic at server: generate unique key using Math.random if collision found → regenerate
   },

   isLive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
   },

}, {
   timestamps: true
});

module.exports = Exam;
