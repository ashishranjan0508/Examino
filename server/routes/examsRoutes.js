const express = require("express");
const examRouter = express.Router();

const userAuth = require("../middlewares/userAuthentication.js");
const userAuthorize = require("../middlewares/userAuthorization.js");


const examControllers = require("../controllers/examControllers.js");
const questionControllers = require("../controllers/questionControllers.js");

examRouter.post('/create', userAuth, userAuthorize.isTeacher, examControllers.createExam);
examRouter.get('/get_all', userAuth, userAuthorize.isTeacher, examControllers.getExamsByTeacher);
examRouter.patch('/toggle/:examId', userAuth, userAuthorize.isTeacher, examControllers.toggleExamStatus);


examRouter.post('/join', userAuth, userAuthorize.isStudent, examControllers.joinExam);
examRouter.get('/start/:examId', userAuth, userAuthorize.isStudent, examControllers.startExam);
examRouter.post('/submit/:examId', userAuth, userAuthorize.isStudent, examControllers.submitExam);

examRouter.get('/questions/:examId', userAuth, questionControllers.getQuestionsByExam);

module.exports = examRouter;