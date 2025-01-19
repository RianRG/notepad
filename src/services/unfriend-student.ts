import { PrismaService } from "../repositories/prisma/prisma-service";

export class UnfriendService{
  constructor(private prisma: PrismaService){};

  async execute(username: string, friendName: string){

    if(username === friendName) throw new Error('You cannot unfriend yourself!')

    const friend = await this.prisma.student.findUnique({
      where: {
        username: friendName
      }
    })
    const student = await this.prisma.student.findUnique({
      where: {
        username
      }
    })

    if(!friend || !student)
      throw new Error('Student not found!')


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

    await this.prisma.friendRequest.delete({
      where: {
        id: friendship.id
      }
    })
  }
}