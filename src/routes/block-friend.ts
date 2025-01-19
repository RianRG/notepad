import { z } from "zod";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { BlockFriendService } from "../services/block-friend";
import { FastifyTypedInstance } from "../types";
import { authorizeMiddleware } from "../middlewares/authorize-middleware";
import { GetStudentBySessionIdService } from "../services/get-student-by-sessionId";

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
    const { sessionId } = req.auth;
    const { friendName } = req.params;
    const prismaRepository = new PrismaService()
    const blockFriendService = new BlockFriendService(prismaRepository)
    const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);

    const student = await getStudentBySessionIdService.execute(sessionId);

    await blockFriendService.execute(student.username, friendName);
    return res.status(200).send({ msg: 'Student blocked succesfully!' })
  })
}