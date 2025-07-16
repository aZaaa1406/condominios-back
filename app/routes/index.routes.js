import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import userRoutes from "./user.routes.js";
import residentRoutes from "./resident.routes.js";
const routes = Router();

routes.use('/admin', adminRoutes)
routes.use('/user', userRoutes)
routes.use('/resident', residentRoutes)

export default routes;