import { PrismaService } from "../repositories/prisma/prisma-service";
import { GetFriendNotesService } from "../services/get-friend-notes";
import { FastifyTypedInstance } from "../types";

export async function GetFriendNotesRoute(app: FastifyTypedInstance){
  app.get('/friends/notes', {}, async (req, res) =>{
    const { sessionId } = req.auth;

    const prismaRepository = new PrismaService()
    const getFriendNotesService = new GetFriendNotesService(prismaRepository)

    const friendsNotes = await getFriendNotesService.execute(sessionId)
    return res.status(200).send({ notes: friendsNotes })
  })
}