const Sequelize = require("sequelize");
const sequelize = require("../config/db"); 

const Result = Sequelize.define("result", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users', 
            key: 'id'
        }
    },

    examId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'exams', 
            key: 'id'
        }
    },
    
    score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    totalMarks: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    status: {
        type: Sequelize.ENUM('Live', 'Completed'),
        defaultValue: 'Live'
    },

    startTime: {
        type: Sequelize.DATE,
        allowNull: true
    },
    endTime: {
        type: Sequelize.DATE,
        allowNull: true
    }

}, {
    timestamps: true
});

module.exports = Result;