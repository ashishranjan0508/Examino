const express = require("express");
const questionRouter = express.Router();

const userAuth = require("../middlewares/userAuthentication.js");
const userAuthorize = require("../middlewares/userAuthorization.js");

const questionController = require("../controllers/questionsControllers.js");


questionRouter.post('/:examId', userAuth, userAuthorize.isTeacher, questionController.addQuestion);
questionRouter.get('/:examId', userAuth, questionController.getQuestionsByExam);
questionRouter.delete('/:questionId', userAuth, userAuthorize.isTeacher, questionController.deleteQuestion);


module.exports = questionRouter;