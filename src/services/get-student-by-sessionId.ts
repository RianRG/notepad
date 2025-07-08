import { PrismaService } from "../repositories/prisma/prisma-service";
// import { client } from "../lib/redis";


export class GetStudentBySessionIdService{
  constructor(private prisma: PrismaService){};

  async execute(sessionId: string){

    // const cachedStudent = await client.hGetAll(sessionId)
    // console.log(cachedStudent)
    // if(cachedStudent)
    //   return cachedStudent;

    const student = await this.prisma.student.findUnique({
      where: {
        sessionId
      }
    })

    if(!student) throw new Error();
    return student
  }
}