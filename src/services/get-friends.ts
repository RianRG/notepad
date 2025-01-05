import { PrismaService } from "../repositories/prisma/prisma-service";

export class GetFriendsService{
  constructor(private prisma: PrismaService){};

  async execute(sessionId: string){
    const student = await this.prisma.student.findUnique({
      where: {
        sessionId
      },
      include: {
        friendRequestsReceived: true,
        friendRequestsSent: true
      }
    })
    if(!student) throw new Error('Student not found!')

    const friendRequests = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            receiverId: student.id,
            status: "ACCEPTED"
          },
          {
            senderId: student.id,
            status: "ACCEPTED"
          }
        ]
      },
      include: {
        receiver: true,
        sender: true
      }
    })
    if(!friendRequests) throw new Error("You don't have any friends!")

    const friends = friendRequests.reduce((acm: Object[], friendRequest, k): Object[] =>{
      if(friendRequest.receiver.username !== student.username){
        acm.push(friendRequest.receiver)
      } else{
        acm.push(friendRequest.sender)
      }

      return acm;
    }, [])
    return friends;
  }
}