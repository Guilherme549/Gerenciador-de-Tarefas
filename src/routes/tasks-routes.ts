import { Router } from "express";
import { TasksController } from "@/controllers/tasks-controller";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const tasksRouter = Router()
const tasksController = new TasksController()

tasksRouter.use(ensureAuthenticated)
tasksRouter.post("/", tasksController.create)
tasksRouter.get("/", tasksController.index)
tasksRouter.put("/:id", tasksController.updated)
tasksRouter.delete("/:id/delete", tasksController.delete)

export { tasksRouter }