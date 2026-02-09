const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const Answer = sequelize.define("answer", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
    },

    examId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "exams",
            key: "id",
        },
    },

    questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "questions",
            key: "id",
        },
    },

    selectedOptionId: {                        // For MCQ  store selected option id OR option key ("A")
        type: Sequelize.INTEGER,
        allowNull: true,
    },
                                              
    answerText: {                              // For LONG answers
        type: Sequelize.TEXT,
        allowNull: true,
    },

    isCorrect: {
        type: Sequelize.BOOLEAN,
        allowNull: true,                       // null until evaluated
    },

    marksAwarded: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
    },

}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ["studentId", "questionId"],
        },
    ],
});

module.exports = Answer;
