import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { validTeamOrAdm } from "@/utils/validTeamOrAdm";
import { Request, Response } from "express";
import { z } from "zod"

const date = new Date()

const horaBrasilia = new Date(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

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

    async index(request: Request, response: Response){
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        await validTeamOrAdm(request, id)

        const listTaskOfUserTeams = await prisma.task.findMany({
            where: { teamId: id },
            include: {
                team: {
                    select: {
                        name: true
                    }
                },
                user: {
                    select: {
                        name: true
                    }
                }
            }
        })
        
        return response.json( {Tasks: listTaskOfUserTeams})
    }

    async updated(request: Request, response: Response){
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const bodySchema = z.object({
            title: z.string().max(200),
            description: z.string().min(1),
            status: z.enum(['pending','in_progress','completed']),
            priority: z.enum(['high','average','low']),
            assigned_to: z.string().uuid(),
            team_id: z.string().uuid().optional()
        })

        const { id } = paramsSchema.parse(request.params)
        const { title, description, status, priority, assigned_to, team_id} = bodySchema.parse(request.body)

        await validTeamOrAdm(request, id)

        const taskExist = await prisma.task.findUnique({
           where: { id } 
        })

        if(!taskExist){
            throw new AppError("This task doesn't exist.")
        }

        const userExsit = await prisma.user.findUnique({
            where: { id: assigned_to }
        })

        if(!userExsit){
            throw new AppError("This user doesn't exist.")
        }

        const teamsExist = await prisma.team.findUnique({
            where: { id: team_id}
        })

        if(!teamsExist){
            throw new AppError("This Team doesn't exist.")
        }

        const task = await prisma.task.update({
            where: {
                id
            },

            data : {
                title: title || undefined,
                description: description || undefined,
                status: status || undefined,
                priority:  priority || undefined,
                assignedTo: assigned_to || undefined,
                teamId: team_id || undefined,
            }

        })

        await prisma.task_history.create({
            data: {
                task_id: id,
                changed_by: request.user?.id,
                old_status: taskExist.status,
                new_status: status,
                changedAt: horaBrasilia,
            }
        })

        return response.json(task)
    }

    async delete(request: Request, response: Response){
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        await validTeamOrAdm(request, id)

        const taskExist = await prisma.task.findUnique({
            where: { id }
        })

        if(!taskExist){
            throw new AppError("This task doesn't exist.")
        }

       prisma.task.delete({
            where: { id }
        })

        return response.status(204).json()
    }
}   

export { TasksController }