const express = require("express");
const userRouter = express.Router();

const userControllers = require("../controllers/userControllers.js");

userRouter.post('/register', userControllers.registerUser);
userRouter.post('/login', userControllers.loginUser);

module.exports = userRouter;