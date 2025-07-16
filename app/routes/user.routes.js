import { Router } from "express";
import { LoginUser, LogoutUser, forgotPassword, resetPassword, getInfoUser} from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.post('/login', LoginUser)
userRoutes.post('/logout', LogoutUser);
userRoutes.post('/forgot-password', forgotPassword);
userRoutes.post('/reset-password', resetPassword);
userRoutes.get('/getInfoUser', getInfoUser);

export default userRoutes;