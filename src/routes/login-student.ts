import { PrismaService } from "../repositories/prisma/prisma-service";
import { GetStudentByEmailService } from "../services/get-student-by-email";
import { FastifyTypedInstance } from "../types";
import { z } from 'zod';
import { compare } from "bcrypt";
import { UpdateSessionIdService } from "../services/update-sessionid";

export async function LoginStudentRoute(app: FastifyTypedInstance){
  app.post('/login', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6)
      })
    }
  }, async (req, res) =>{
    const { email, password } = req.body;

    const prismaRepository = new PrismaService()

    const getStudentByEmailService = new GetStudentByEmailService(prismaRepository)
    const updateSessionIdService = new UpdateSessionIdService(prismaRepository)

    const student = await getStudentByEmailService.execute(email);

    if(!await compare(password, student.password)){
      return res.status(401).send({ msg: 'Email or password incorrect!' })
    }

    const sessionId = app.jwt.sign({ user: student.username })
        res.setCookie('sessionId', sessionId, {
            path: '/',
            httpOnly: true,
            signed: true,
            sameSite: 'none',
            maxAge: 1000 * 3600 * 24 * 7 // 7 days
        })
    const cookie = app.signCookie(sessionId)
    const loggedStudent = await updateSessionIdService.execute(cookie, student.id);

    return res.status(201).send({ login: loggedStudent })
  })
};