import { authorizeMiddleware } from "../middlewares/authorize-middleware";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { GetFriendsService } from "../services/get-friends";
import { FastifyTypedInstance } from "../types";

export async function GetFriendsRoute(app: FastifyTypedInstance){
  app.get('/friends', {
    preHandler: [authorizeMiddleware]
  }, async (req, res) =>{
    const { sessionId } = req.cookies;
    if(!sessionId) throw new Error('Unauthorized!')
    const prismaRepository = new PrismaService();
    const getFriendsService = new GetFriendsService(prismaRepository);

    const friends = await getFriendsService.execute(sessionId)
    return res.status(200).send({ friends })
  })
}