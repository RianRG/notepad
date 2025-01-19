import { authorizeMiddleware } from "../middlewares/authorize-middleware";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { GetNotesService } from "../services/get-notes";
import { GetStudentBySessionIdService } from "../services/get-student-by-sessionId";
import { FastifyTypedInstance } from "../types";
import { z } from 'zod';

export async function GetNotesRoute(app: FastifyTypedInstance){
  app.get('/notes', 
    {
      schema: {
        // response: {
        //   200: z.array(z.object({
        //     title: z.string(),
        //     content: z.string(),
        //     isPrivate: z.boolean(),
        //     createdAt: z.date(),
        //   }))
        // }
      },
      preHandler: [authorizeMiddleware]
    },async (req, res) =>{
      const prismaRepository = new PrismaService();
      
      const { sessionId } = req.auth;

      const getNotesService = new GetNotesService(prismaRepository);
      const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository)
      const student = await getStudentBySessionIdService.execute(sessionId)

      const notes = await getNotesService.execute(student.id)
      return res.status(200).send(notes)
  })
}