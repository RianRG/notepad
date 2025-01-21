import { authorizeMiddleware } from "../middlewares/authorize-middleware";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { GetStudentBySessionIdService } from "../services/get-student-by-sessionId";
import { RegisterNotesService } from "../services/register-notes";
import { FastifyTypedInstance } from "../types";
import { z } from 'zod';

export async function RegisterNoteRoute(app: FastifyTypedInstance){
    app.post('/notes/register', {
        preHandler: [authorizeMiddleware],
        schema: {
            body: z.object({
                title: z.string(),
                content: z.string(),
                isPrivate: z.boolean(),
            }),
            // response: {
            //     201: z.object({
            //         notes: z.object({
                      
            //         })
            //     })
            // }
        }
    }, async (req, res) =>{

        const {sessionId} = req.auth;
        const { title, content, isPrivate } = req.body;
        const prismaRepository = new PrismaService();
        const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
        const registerNotesService = new RegisterNotesService(prismaRepository);
        
        const student = await getStudentBySessionIdService.execute(sessionId);

        if(!student) throw new Error();

        const notes = await registerNotesService.execute({ title, content, isPrivate, studentId: student.id })

        return res.status(201).send({ notes })
    })
}