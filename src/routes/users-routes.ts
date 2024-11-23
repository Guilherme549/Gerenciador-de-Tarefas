import { Router } from "express";

import { UsersController } from "@/controllers/users-controller";
import { verifyUserAuthorization } from "@/middleware/verifyUserAuthorization";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";


const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post("/", usersController.create)
usersRoutes.get("/", ensureAuthenticated , verifyUserAuthorization(['admin']) ,usersController.index)

export { usersRoutes }
