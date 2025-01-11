import { authorizeMiddleware } from "../middlewares/authorize-middleware";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { UnfriendService } from "../services/unfriend";
import { GetStudentBySessionIdService } from "../services/get-student-by-sessionId";
import { FastifyTypedInstance } from "../types";
import { z } from 'zod';

export async function UnfriendRoute(app: FastifyTypedInstance){
  app.delete('/block/:friendName', {
    preHandler: [authorizeMiddleware],
    schema: {
      params: z.object({
        friendName: z.string()
      }),
      cookies: z.object({
        sessionId: z.string()
      })
    }
  }, async (req, res) =>{
    const { sessionId } = req.cookies;
    const { friendName } = req.params;
    
    if(!sessionId) throw new Error('Unauthorized!')

    const prismaRepository = new PrismaService()
    const unfriendService = new UnfriendService(prismaRepository)
    
    const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository)

    const student = await getStudentBySessionIdService.execute(sessionId)


    await unfriendService.execute(student.username, friendName)

    return res.status(200).send({ msg: 'Student blocked succesfully!' })
  })
}