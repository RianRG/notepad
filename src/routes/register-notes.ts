import { PrismaService } from "../repositories/prisma/prisma-service";
import { RegisterNotesService } from "../services/register-notes";
import { FastifyTypedInstance } from "../types";
import { z } from 'zod';

export async function RegisterNoteRoute(app: FastifyTypedInstance){
    app.post('/notes/register', {
        schema: {
            body: z.object({
                title: z.string(),
                content: z.string(),
                isPrivate: z.boolean(),
                studentId: z.string()
            }),
            response: {
                201: z.object({
                    msg: z.string()
                })
            }
        }
    }, async (req, res) =>{
        const { title, content, isPrivate, studentId } = req.body;
        const prismaRepository = new PrismaService();
        const registerNotestService = new RegisterNotesService(prismaRepository);

        const notes = await registerNotestService.execute({ title, content, isPrivate, studentId })

        return res.status(201).send({ msg: 'Note created succesfully!' })
    })
}