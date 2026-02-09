const sequelize = require("../config/db.js");
const Sequelize = require("sequelize");

const Option = sequelize.define("option", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "questions",
            key: "id",
        },
    },

    optionText: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    isCorrect: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: false,
});

module.exports = Option;
