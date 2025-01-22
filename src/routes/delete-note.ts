import { authorizeMiddleware } from "../middlewares/authorize-middleware";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { DeleteNoteService } from "../services/delete-note";
import { GetStudentBySessionIdService } from "../services/get-student-by-sessionId";
import { FastifyTypedInstance } from "../types";
import { z } from 'zod';

export async function DeleteNoteRoute(app: FastifyTypedInstance){
  app.delete('/notes/:noteId', 
    {
      preHandler: [authorizeMiddleware],
      schema: {
        params: z.object({
          noteId: z.string()
        })
      }
    },async (req, res) =>{
      const { sessionId } = req.auth;
      const { noteId } = req.params;
    const prismaRepository = new PrismaService();
    const deleteNoteService = new DeleteNoteService(prismaRepository);
    const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
    const student = await getStudentBySessionIdService.execute(sessionId);
    if(!student)
      return res.status(400).send({ msg: 'Student not found!' })
    
    await deleteNoteService.execute(noteId)

    return res.status(200).send({ msg: 'Note deleted succesfully!' })
  })
}