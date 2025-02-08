import { client } from "../lib/redis";
import { PrismaService } from "../repositories/prisma/prisma-service";

export class UpdateSessionIdService{
  constructor(private prisma: PrismaService){};

  async execute(sessionId: string, id: string){
    const oldStudent = await this.prisma.student.findUnique({
      where: {
        id
      }
    })

    if(!oldStudent) throw new Error('Student not found!');

    const updatedStudent = await this.prisma.student.update({
      where: {
        id
      },
      data: {
        sessionId
      }
    })

    await client.del(oldStudent.sessionId)
    await client.hSet(sessionId, {
      username: updatedStudent.username,
      email: updatedStudent.email,
      password: updatedStudent.password,
      sessionId
    })

    return updatedStudent;
  }
}