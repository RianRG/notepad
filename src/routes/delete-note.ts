import { authorizeMiddleware } from "../middlewares/authorize-middleware";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { DeleteNoteService } from "../services/delete-note";
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

      const { noteId } = req.params;
    const prismaRepository = new PrismaService();
    const deleteNoteService = new DeleteNoteService(prismaRepository);

    await deleteNoteService.execute(noteId)

    return res.status(200).send({ msg: 'Note deleted succesfully!' })
  })
}