const sequelize = require("..config/db.js");
const Sequelize = require("sequelize");

const User = require("./userModel");
const Exam = require("./examModel");
const Option = require("./mcqOptionModel");
const Answer = require("./answerModel");
const Question = require("./questionModel");

// Association b/w user(teacher and exam)

User.hasMany('Exam', {
   foreignKey : 'teacherId',
   onDelete: 'CASCADE'});
Exam.belongsTo('User', {foreignKey : 'teacherId', as : 'teacher'});

//Association b/w Exam and Question

Exam.hasMany('Question', {
   foreignKey : 'examId',
   onDelete: 'CASCADE'});
Question.belongsTo('Exam', {foreignKey : 'examId'});

// Association b/w Exam and Answer 

Exam.hasMany('Answer', {
   foreignKey : 'ExamId',
   onDelete: 'CASCADE'});
Answer.belongsTo('Exam', {foreignKey : 'ExamId'});

// Association b/w Student and answer
 User.hasMany('Answer', {
   foreignKey : 'studentId',
   onDelete: 'CASCADE'});
 Answer.belongsTo('User', {foreignKey : 'stuedentId', as : 'student'});

 //Association b/w Question to option

 Question.hasMany('Option', {
   foreignKey : 'questionId',
   onDelete: 'CASCADE'});
 Option.belongsTo('Question', {foreignKey : 'questionId'});

 // Association b/w Question and Answer

 Question.hasMany(Answer, {
   foreignKey: 'questionId',
   onDelete: 'CASCADE'});
 Answer.belongsTo(Question, {foreignKey: 'questionId'});

 // Association b/w option an Answer

 Option.hasMany(Answer, {
   foreignKey: 'selectedOptionId',
   onDelete: 'CASCADE'});
 Answer.belongsTo(Option, {foreignKey: 'selectedOptionId', as: 'selectedOption'});

 const db = {
    sequelize,
    Sequelize,
    User,
    Exam,
    Option,
    Answer,
    Question,
 };

 module.exports = db;
