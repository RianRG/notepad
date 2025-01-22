import { authorizeMiddleware } from "../middlewares/authorize-middleware";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { GetFriendRequestsService } from "../services/get-friend-requests";
import { FastifyTypedInstance } from "../types";

export async function GetFriendRequestsRoute(app: FastifyTypedInstance){
  app.get('/friendRequests', {
    preHandler: [authorizeMiddleware]
  },async (req, res) =>{
    const { sessionId } = req.auth;

    const prismaRepository = new PrismaService();
    const getFriendRequestsService = new GetFriendRequestsService(prismaRepository);

    const friendRequests = await getFriendRequestsService.execute(sessionId)

    return res.status(200).send({ friendRequests })
  })
}