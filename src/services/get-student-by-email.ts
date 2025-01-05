import { PrismaService } from "../repositories/prisma/prisma-service";

export class GetStudentByEmailService{
  constructor(private prisma: PrismaService){};

  async execute(email: string){
    const student = await this.prisma.student.findUnique({
      where: {
        email
      }
    })

    if(!student) throw new Error('Student not found!')

      return student;
  }
}