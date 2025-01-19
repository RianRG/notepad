import { authorizeMiddleware } from "../middlewares/authorize-middleware";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { AddFriendService } from "../services/add-friend";
import { GetStudentBySessionIdService } from "../services/get-student-by-sessionId";
import { FastifyTypedInstance } from "../types";
import { z } from 'zod';

export async function AddFriendRoute(app: FastifyTypedInstance){
  app.post('/add/:friendName', {
    preHandler: [authorizeMiddleware],
    schema: {
      params: z.object({
        friendName: z.string()
      }),
      response: {
        201: z.object({
          msg: z.string()
        })
      }
    }
  }, async (req, res) =>{
    const { friendName } = req.params;
    const { sessionId } = req.auth;
    
    const prismaRepository = new PrismaService();
    const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
    const addFriend = new AddFriendService(prismaRepository)
    const student = await getStudentBySessionIdService.execute(sessionId);
    await addFriend.execute(student.username, friendName)
    
    return res.status(201).send({ msg: 'Friend request sent!' })
  })
}