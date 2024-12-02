import { prisma } from "@/database/prisma";
import { Request } from "express";
import { AppError } from "./AppError";


// Valida se o usuario pertence aquele. E se for Admin ele poder listar as task
export async function validTeamOrAdm(request: Request, id: string){
    const userIsFromThisTeam = await prisma.team_member.findFirst({
        where: { teamId: id, userId: request.user?.id },
        select: {
            userId: true
        }
    })

    if(!userIsFromThisTeam && request.user?.role === 'member'){
        throw new AppError("This user is not on this team.")
    }

    return;

}