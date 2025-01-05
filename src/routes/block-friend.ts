import { authorizeMiddleware } from "../middlewares/authorize-middleware";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { BlockFriendService } from "../services/block-friend";
import { GetStudentBySessionIdService } from "../services/get-student-by-sessionId";
import { FastifyTypedInstance } from "../types";
import { z } from 'zod';

export async function BlockFriendRoute(app: FastifyTypedInstance){
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
    const blockFriendService = new BlockFriendService(prismaRepository)
    
    const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository)

    const student = await getStudentBySessionIdService.execute(sessionId)


    await blockFriendService.execute(student.username, friendName)

    return res.status(200).send({ msg: 'Student blocked succesfully!' })
  })
}