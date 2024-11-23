import { Router } from "express";

import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { teamsRoutes } from "./teams-routes";
import { teamsMembersRoutes } from "./teams-members-routes";
import { tasksRouter } from "./tasks-routes";

const routes = Router()

// Usuarios
routes.use("/users", usersRoutes)
// Sessao do Usuario
routes.use("/sessions", sessionsRoutes)
// Equipes
routes.use("/teams", teamsRoutes)
routes.use("/teams-member", teamsMembersRoutes)
// Tarefas
routes.use("/tasks", tasksRouter)

export { routes }