import { PrismaService } from "../repositories/prisma/prisma-service";

interface RegisterStudentDTO{
  username: string
  email: string
  password: string
}

export class RegisterStudentService{
  constructor(private prisma: PrismaService){};

  async execute({username, email, password}: RegisterStudentDTO){
    const studentWithSameEmail = await this.prisma.student.findUnique({
      where: {
        email
      }
    })

    const studentWithSameUserName = await this.prisma.student.findUnique({
      where: {
        username
      }
    })

    if(studentWithSameEmail || studentWithSameUserName)
      throw new Error('Student already exists!')


    return await this.prisma.student.create({
      data: {
        username,
        email,
        password
      }
    })
  }
}