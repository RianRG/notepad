import { PrismaService } from "../repositories/prisma/prisma-service";

export class AddFriendService{
  constructor(private prisma: PrismaService){};


  async execute(requesterName: string, receiverName: string){

    if(requesterName === receiverName)
      throw new Error('You cannot add yourself!')

    const requester = await this.prisma.student.findUnique({
      where: {
        username: requesterName
      },
      include: {
        friendRequestsReceived: true,
        friendRequestsSent: true
      }
    })
    if(!requester)
      throw new Error('Student not found!')


    const receiver = await this.prisma.student.findUnique({
      where: {
        username: receiverName
      },
      include: {
        friendRequestsReceived: true,
        friendRequestsSent: true,
      }
    })
    if(!receiver)
      throw new Error('Student not found!')

    const isAlreadyFriend = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: requester.id,
            receiverId: receiver.id,
            status: "ACCEPTED"
          },
          {
            senderId: receiver.id,
            receiverId: requester.id,
            status: "ACCEPTED"
          }
        ]
      }
    })
    if(isAlreadyFriend)
      throw new Error(`You and ${receiverName} are already friends!`)


    const isAlreadySent = receiver.friendRequestsReceived.filter(request =>{
   
      return request.senderId === requester.id
    })
    if(isAlreadySent.length>0)
      throw new Error(`You have already sent a request to ${receiverName}`)


    const isAlreadyReceived = receiver.friendRequestsSent.filter(request =>{
      return request.receiverId === requester.id
    })
    if(isAlreadyReceived.length>0){

      await this.prisma.friendRequest.update({
        where: {
          id: isAlreadyReceived[0].id
        },
        data: {
          status: "ACCEPTED"
        }
      })
     
     return 2;
    }

    await this.prisma.friendRequest.create({
      data: {
        receiverId: receiver.id,
        senderId: requester.id,
        status: "PENDING"
      }
    })
    return 3;
  }
}
