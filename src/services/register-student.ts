import { PrismaService } from "../repositories/prisma/prisma-service";
// import { client } from "../lib/redis";

interface RegisterStudentDTO{
  username: string
  email: string
  password: string,
  sessionId: string
}

export class RegisterStudentService{
  constructor(private prisma: PrismaService){};

  async execute({username, email, password, sessionId}: RegisterStudentDTO){

    

    const studentWithSameEmail = await this.prisma.student.findUnique({
      where: {
        email
      }
    })

    const studentWithSameUsername = await this.prisma.student.findUnique({
      where: {
        username
      }
    })

    if(studentWithSameEmail || studentWithSameUsername)
      throw new Error('Student already exists!')


    const student = await this.prisma.student.create({
      data: {
        username,
        email,
        password,
        sessionId
      }
    })

    // await client.hSet(sessionId, {
    //   id: student.id,
    //   username,
    //   email,
    //   password,
    //   createdAt: student.createdAt.toString()
    // })

    return student;
  }
}