import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod"


class TeamsController {
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            name: z.string(),
            description: z.string().max(50)
        })

        const { name, description } = bodySchema.parse(request.body)

        const teamWithSameName = await prisma.team.findFirst({
            where: { name }
        })

        if(teamWithSameName){
            throw new AppError("Team name already exists.", 409)
        }

        const team = await prisma.team.create({
            data: {
                name,
                description
            }
        })
        
        return response.status(201).json(team)
    }

    async index(request: Request, response: Response){
        const teamsName = await prisma.team.findMany()

        return response.json(teamsName)
    }

    
}

export { TeamsController }  