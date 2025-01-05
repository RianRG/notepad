import { PrismaService } from "../repositories/prisma/prisma-service";

export class GetStudentBySessionIdService{
  constructor(private prisma: PrismaService){};

  async execute(sessionId: string){
    const student = await this.prisma.student.findUnique({
      where: {
        sessionId
      }
    })

    if(!student) throw new Error();
    return student
  }
}