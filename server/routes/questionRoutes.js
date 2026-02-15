const express = require("express");
const questionRouter = express.Router();

const userAuth = require("../middlewares/userAuthentication.js");
const userAuthorize = require("../middlewares/userAuthorization.js");

const questionControllers = require("../controllers/questionControllers.js");


questionRouter.post('/:examId', userAuth, userAuthorize.isTeacher, questionControllers.addQuestion);
questionRouter.get('/:examId', userAuth, questionControllers.getQuestionsByExam);
questionRouter.delete('/:questionId', userAuth, userAuthorize.isTeacher, questionControllers.deleteQuestion);


module.exports = questionRouter;