import { z } from "zod";
import { FastifyTypedInstance } from "../types";
import { authorizeMiddleware } from "../middlewares/authorize-middleware";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { UpdateNoteService } from "../services/update-note";

export async function UpdateNoteRoute(app: FastifyTypedInstance){
  app.put('/notes/:noteId', 
    {
      preHandler: [authorizeMiddleware],
      schema: {
        body: z.object({
          title: z.string(),
          content: z.string(),
          isPrivate: z.boolean()
        }),
        params: z.object({
          noteId: z.string()
        })
      }
    },async (req, res) =>{
      const { sessionId } = req.auth
      const { noteId } = req.params
      const { title, content, isPrivate } = req.body
      const prismaRepository = new PrismaService();
      const updateNoteService = new UpdateNoteService(prismaRepository);

      const note = await updateNoteService.execute(noteId, { title, content, isPrivate });

      return res.status(201).send({ note })
  })
}