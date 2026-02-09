const sequelize = require("../config/db.js");
const Sequelize = require("sequelize");

const Question = sequelize.define("question", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    examId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "exams",
            key: 'id',
        }
    },
     type: {
        type: Sequelize.ENUM("MCQ", "LONG"),
        allowNull: false,
    },
    questionText: {
        type: Sequelize.TEXT,
        allowNull:false,
    },
    marks: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }},
    {
    timestamps: true,
    }
    );

module.exports = Question;