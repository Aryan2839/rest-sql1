import { Router } from "express";
import usersRouter from "./user.routes.js";

const routes=Router();

routes.use("/users",usersRouter); 

export default routes;