import { PrismaService } from "../repositories/prisma/prisma-service";

export class UpdateSessionIdService{
  constructor(private prisma: PrismaService){};

  async execute(sessionId: string, id: string){
    return await this.prisma.student.update({
      where: {
        id
      },
      data: {
        sessionId
      }
    })
  }
}