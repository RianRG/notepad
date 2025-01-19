import { z } from "zod";
import { PrismaService } from "../repositories/prisma/prisma-service";
import { GetStudentBySessionIdService } from "../services/get-student-by-sessionId";
import { FastifyTypedInstance } from "../types";
import { FastifySchemaWithCookies } from "fastify";
import { authorizeMiddleware } from "../middlewares/authorize-middleware";

export async function GetSessionRoute(app:FastifyTypedInstance){
  app.get('/session', {
    preHandler: [authorizeMiddleware]
  },async (req, res) =>{
    const { sessionId } = req.auth;
    const prismaRepository = new PrismaService();
    const getStudentBySessionId = new GetStudentBySessionIdService(prismaRepository);

    const student = await getStudentBySessionId.execute(sessionId);

    return res.status(200).send({ student });
  })
}