const sequelize = require("../config/db");
const {Sequelize} = require('sequelize');

const User = sequelize.define({
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false,
    },
    studentRollNo : {
        type : Sequelize.INTEGER,
        allowNull : true,
    },
    email : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true,
    },
    password : {
        type : Sequelize.STRING,
        allowNull : false,
    },

    userRoll : {
        type : Sequelize.ENUM('teacher', 'student'),
        defaultValue : 'student',
        allowNull : false,
    }
});
