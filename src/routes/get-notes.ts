import { PrismaService } from "../repositories/prisma/prisma-service";
import { GetNotesService } from "../services/get-notes";
import { FastifyTypedInstance } from "../types";
import { z } from 'zod';

export async function GetNotesRoute(app: FastifyTypedInstance){
  app.get('/notes', 
    {
      schema: {
        response: {
          200: z.array(z.object({
            title: z.string(),
            content: z.string(),
            isPrivate: z.boolean(),
            createdAt: z.date(),
          }))
        }
      }
    },async (req, res) =>{
      const prismaRepository = new PrismaService();
      // after login implementation, get user cookies
      const getNotesService = new GetNotesService(prismaRepository);

      // const notes = await getNotesService.execute('eb054b69-3201-48e5-be7d-b651a6609429')\
      // return res.status(200).send(notes)
  })
}