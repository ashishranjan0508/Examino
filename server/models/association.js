const sequelize = require("../config/db.js");
const Sequelize = require("sequelize");

const User = require("./userModel");
const Exam = require("./examModel");
const Option = require("./mcqOptionModel");
const Answer = require("./answerModel");
const Question = require("./questionModel");

// User (Teacher) → Exam
User.hasMany(Exam, {foreignKey: 'teacherId', onDelete: 'CASCADE'});
Exam.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher'});

// Exam → Question
Exam.hasMany(Question, {foreignKey: 'examId',onDelete: 'CASCADE'});
Question.belongsTo(Exam, {foreignKey: 'examId'});

// Exam → Answer
Exam.hasMany(Answer, {foreignKey: 'examId', onDelete: 'CASCADE'});
Answer.belongsTo(Exam, {foreignKey: 'examId'});

// Student (User) → Answer
User.hasMany(Answer, {foreignKey: 'studentId', onDelete: 'CASCADE'});
Answer.belongsTo(User, {foreignKey: 'studentId',as: 'student'});

// Question → Option
Question.hasMany(Option, {foreignKey: 'questionId',onDelete: 'CASCADE'});
Option.belongsTo(Question, {foreignKey: 'questionId'});

// Question → Answer
Question.hasMany(Answer, {foreignKey: 'questionId',onDelete: 'CASCADE'});
Answer.belongsTo(Question, {foreignKey: 'questionId'});

// Option → Answer
Option.hasMany(Answer, {foreignKey: 'selectedOptionId',onDelete: 'CASCADE'});
Answer.belongsTo(Option, {foreignKey: 'selectedOptionId',as: 'selectedOption'});

// Student -> Result
User.hasMany(Result, { foreignKey: 'studentId' });
Result.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Exam -> Result
Exam.hasMany(Result, { foreignKey: 'examId' });
Result.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Exam,
  Option,
  Answer,
  Question
};

