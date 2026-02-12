const express = require("express");
const userRouter = express.Router();

const userAuth = require("../middlewares/userAuthentication.js");
const userAuthorize = require("../middlewares/userAuthorization.js");

const userControllers = require("../controllers/userControllers.js");


userRouter.post('/register', userControllers.registerUser);
userRouter.post('/login', userControllers.loginUser);



module.exports = userRouter;