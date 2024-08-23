import express from 'express';
import { logInUser, signUpUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/signup', signUpUser);
userRouter.post('/login', logInUser);

export default userRouter;