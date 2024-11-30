import { TeamsMembersController } from "@/controllers/teams-members-controller";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAuthorization";
import { Router } from "express";

const teamsMembersRoutes = Router()
const teamsMembersController = new TeamsMembersController()

teamsMembersRoutes.use(ensureAuthenticated, verifyUserAuthorization(['admin']))

teamsMembersRoutes.post("/", teamsMembersController.create)

teamsMembersRoutes.get("/", teamsMembersController.index)


export { teamsMembersRoutes }