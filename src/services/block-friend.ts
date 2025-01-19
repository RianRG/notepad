import { PrismaService } from "../repositories/prisma/prisma-service";

export class BlockFriendService{
  constructor(private prisma: PrismaService){};

  async execute(studentName: string, friendName: string){
    if(studentName === friendName) throw new Error('You cannot block yourself!');

    const student = await this.prisma.student.findUnique({
      where: {
          username: studentName
      }
    })
    const friend = await this.prisma.student.findUnique({
      where: {
          username: friendName
      }
    })

    if(!student || !friend) throw new Error('Student not found!')

    const friendship = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            receiverId: friend.id,
            senderId: student.id
          },
          {
            receiverId: student.id,
            senderId: friend.id
          }
        ]
      }
    })

    if(!friendship) throw new Error(`You and ${friendName} are not friends!`)

    return await this.prisma.friendRequest.update({
      where: {
        id: friendship.id
      },
      data: {
        status: "REJECTED"
      }
    })
  }
}