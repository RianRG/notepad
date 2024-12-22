import { PrismaService } from "../repositories/prisma/prisma-service";
import { RegisterStudentService } from "../services/register-student";
import { FastifyTypedInstance } from "../types";
import { z } from 'zod';

export async function RegisterStudentRoute(app: FastifyTypedInstance){
    app.post('/students/register', {
        schema: {
            body: z.object({
                username: z.string(),
                email: z.string().email(),
                password: z.string().min(6)
            }),
            response: {
                201: z.object({
                    msg: z.string()
                })
            }
            
        }
    }, async (req, res) =>{
        const { username, email, password } = req.body;
        const prismaRepository = new PrismaService();
        const registerStudentService = new RegisterStudentService(prismaRepository);

        const student = await registerStudentService.execute({ username, email, password })

        return res.status(201).send({ msg: 'Student created succesfully!' })
    })
}