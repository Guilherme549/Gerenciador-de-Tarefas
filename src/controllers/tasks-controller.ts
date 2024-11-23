import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod"

class TasksController {
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            title: z.string().max(200),
            description: z.string().min(1),
            priority: z.enum(['high','average','low']),
            assigned_to: z.string().uuid(),
            team_id: z.string().uuid().optional()
        })

        const { title, description, priority, assigned_to, team_id} = bodySchema.parse(request.body)

        // Verifica se o time existe
        if (team_id) {
            const teamExists = await prisma.team.findUnique({ where: { id: team_id } });
            if (!teamExists) {
                throw new AppError("The specified team does not exist.");
            }
        }

        // Verifica se o usuário existe
        const userExist = await prisma.user.findUnique({ where: { id: assigned_to}})
        if(!userExist){
            throw new AppError("The specified user does not exist.");
        }



        // valida se o usuario selecionado faz parte da equipe selecionada
        if(team_id){
            const validTeamMember = await prisma.team_member.findFirst({
                where: { userId: assigned_to, teamId: team_id}
            })
            if(!validTeamMember){
                throw new AppError("The assigned user does not belong to the specified team.")
            }
        }
        
        const createTaks = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                assignedTo: assigned_to,
                teamId: team_id

            }
        })

        return response.json(createTaks)
    }
}

export { TasksController }