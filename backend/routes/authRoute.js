import express from "express";
import { signup, login, forgotpassword, resetpassword, googlelogin } from "../controllers/authControllers.js";


const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotpassword', forgotpassword);
router.post('/resetpassword/:id', resetpassword)
router.post('/googlelogin', googlelogin);

export default router;