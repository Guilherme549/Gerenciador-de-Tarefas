import { hash } from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod"
import { AppError } from "@/utils/AppError";

class UsersController {
   async create(request: Request, response: Response){
        const bodySchema = z.object({
            name: z.string().trim(),
            email: z.string().email(),
            password: z.string().min(6)
        })

        const { name, email, password} = bodySchema.parse(request.body)
        
        const userWithSameEmail = await prisma.user.findFirst({where: {email}})

        if(userWithSameEmail){
            throw new AppError("User with same email already exists!")
        }

        const hashedPassword = await hash(password, 8)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
        })

        const {password: _, ...userwithourtPassword } = user

        return response.status(201).json(userwithourtPassword)
    }

    async index(request: Request, response: Response){
        const listUsers = await prisma.user.findMany({
            select : {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return response.json(listUsers)
    }
}

export { UsersController }

