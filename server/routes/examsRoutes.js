const express = require("express");
const examRouter = express.Router();

const userAuth = require("../middlewares/userAuthentication.js");
const userAuthorize = require("../middlewares/userAuthorization.js");

const examControllers = require("../controllers/examControllers.js");

examRouter.post('/exam',userAuth, userAuthorize.isTeacher, examControllers.createExam);
examRouter.get('/exam', userAuth, userAuthorize.isTeacher, examControllers.getExamsByTeacher);


module.exports = examRouter;

