import { Router } from "express";
import { TasksController } from "@/controllers/tasks-controller";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const tasksRouter = Router()
const tasksController = new TasksController()

tasksRouter.use(ensureAuthenticated)
tasksRouter.post("/", tasksController.create)

export { tasksRouter }