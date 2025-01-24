import { z } from "zod";
import { authorizeMiddleware } from "../middlewares/authorize-middleware";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { GetStudentByUsernameService } from "../services/get-student-by-username";
import { FastifyTypedInstance } from "../types";

export async function GetStudentRoute(app: FastifyTypedInstance){
  app.get('/students/:username', {
    preHandler: [authorizeMiddleware],
    schema: {
      params: z.object({
        username: z.string()
      })
    }
  },
  async (req, res) =>{
    const { sessionId } = req.auth;
    const { username } = req.params;

    const prismaRepository = new PrismaService();
    const getStudentByUsernameService = new GetStudentByUsernameService(prismaRepository);
    const student = await getStudentByUsernameService.execute(username)
    return res.status(200).send({ student })

  })
}