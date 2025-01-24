import { PrismaService } from "../repositories/prisma/prisma-service";

export class GetStudentByUsernameService{
  constructor(private prisma: PrismaService){};

  async execute(username: string){
    const student = await this.prisma.student.findUnique({
      where: {
        username
      },
      include: {
        notes: {
          where: {
            isPrivate: false
          }
        },
        _count: {
          select: {
            friendRequestsReceived: {
              where: {
                status: "ACCEPTED"
              }
            },
            friendRequestsSent: {
              where: {
                status: "ACCEPTED"
              }
            }
          }
        }
        
      }
    })
    if(!student)
      throw new Error('Student not found!');

    const studentWithFriends = {
      id: student.id,
      sessionId: student.sessionId,
      username: student.username,
      email: student.email,
      password: student.password, 
      createdAt: student.createdAt,
      notes: student.notes,
      friends: student._count.friendRequestsReceived + student._count.friendRequestsSent
    }

    return studentWithFriends
  }
}