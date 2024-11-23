import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod"

class TeamsMembersController {
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            user_id: z.string().uuid(),
            team_id: z.string().uuid()
        })

        const { user_id, team_id } = bodySchema.parse(request.body)

        const teamMemberAlreadyExist = await prisma.team_member.findFirst({
            where: {
                teamId: team_id,
                userId: user_id
            }
        })

        if(teamMemberAlreadyExist){
            throw new AppError("This member has already joined this team.", 409)
        }

        const addUserSomeTeam = await prisma.team_member.create({
            data: {
                userId: user_id,
                teamId: team_id
            }
        })

        return response.status(201).json(addUserSomeTeam)
    }

    async index(request: Request, response: Response){
        const teams = await prisma.team.findMany({
            include: {
                teamMembers: {
                    
                    include: {
                        user: {
                            select:{
                                name: true,
                                id: true
                            }
                        }
                    }
                }
            }
        })


        return response.json(teams)
    }

}

export { TeamsMembersController }



