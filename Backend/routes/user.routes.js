import express from "express";
const router = express.Router();
import { body } from "express-validator";
import {registerUser} from "../controllers/user.controller.js";
import {loginUser} from "../controllers/user.controller.js";
import {authUser} from "../middlewares/auth.middleware.js";
import { getUserProfile } from "../controllers/user.controller.js";
import {logoutUser} from "../controllers/user.controller.js";

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    registerUser
)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    loginUser
)

router.get('/profile', authUser, getUserProfile)

router.get('/logout',authUser, logoutUser)

export default router;